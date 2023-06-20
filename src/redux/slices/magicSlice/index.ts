import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import jc from 'json-cycle'
import { ethers } from 'ethers'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import Keychain from 'react-native-keychain'
import {
  RifWalletServicesAuth,
  RifWalletServicesFetcher,
} from '@rsksmart/rif-wallet-services'

import { getMagicWallet } from 'src/storage/MainStorage'
import { magic } from 'src/core/CoreWithStore'
import { AppDispatch, AsyncThunkWithTypes } from 'store/store'
import {
  authAxios,
  publicAxios,
  rifRelayConfig,
  authClient,
} from 'src/core/setup'
import { createRifWalletDictionaries } from 'src/core/operations'
import { Wallets, WalletsIsDeployed } from 'src/Context'
import { navigationContainerRef } from 'core/Core'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import {
  deleteSignUp,
  getSignUP,
  hasSignUP,
  saveSignUp,
} from 'storage/MainStorage'
import { defaultChainId } from 'core/config'
import {
  SocketsEvents,
  rifSockets,
  socketsEvents,
} from 'src/subscriptions/rifSockets'

import { MagicState, UnlockWithMagicAction } from './types'
import {
  onRequest,
  setChainId,
  setUnlocked,
  setWallets,
} from '../settingsSlice'
import { UsdPricesState } from '../usdPricesSlice'

//TODO: extract to shared, use in settingsSlice

const createFetcherConnectToRifSockets = async (
  wallet: RIFWallet,
  dispatch: AppDispatch,
  usdPrices: UsdPricesState,
  rejectWithValue: (value: string) => void,
) => {
  const chainId = await wallet.getChainId()

  dispatch(setChainId(chainId))

  const rifWalletAuth = new RifWalletServicesAuth<
    Keychain.Options,
    ReturnType<typeof Keychain.setInternetCredentials>,
    ReturnType<typeof Keychain.resetInternetCredentials>
  >(publicAxios, wallet, {
    authClient,
    onGetSignUp: getSignUP,
    onHasSignUp: hasSignUP,
    onDeleteSignUp: deleteSignUp,
    onSaveSignUp: saveSignUp,
    onSetInternetCredentials: Keychain.setInternetCredentials,
    onResetInternetCredentials: Keychain.resetInternetCredentials,
  })

  const { accessToken, refreshToken } = await rifWalletAuth.login()

  const fetcherInstance = new RifWalletServicesFetcher<
    Keychain.Options,
    ReturnType<typeof Keychain.setInternetCredentials>
  >(authAxios, accessToken, refreshToken, {
    defaultChainId,
    onSetInternetCredentials: Keychain.setInternetCredentials,
    resultsLimit: 10,
  })

  // connect to sockets
  rifSockets({
    wallet,
    fetcher: fetcherInstance,
    dispatch,
    setGlobalError: rejectWithValue,
    usdPrices,
  })

  socketsEvents.emit(SocketsEvents.CONNECT)
}

const initialState: MagicState = {
  loading: false,
}

export const unlockWithMagic = createAsyncThunk<
  string,
  UnlockWithMagicAction,
  AsyncThunkWithTypes
>('magic/unlockWithMagic', async (action, thunkAPI) => {
  try {
    let result: string | null = null

    switch (action.type) {
      case 'email':
        result = await magic.auth.loginWithEmailOTP({
          email: action.email,
        })
        break
      case 'phone':
        result = await magic.auth.loginWithSMS({
          phoneNumber: action.phoneNumber,
        })
        break

      default:
        result = null
        break
    }

    if (!result) {
      return thunkAPI.rejectWithValue('No Key returned')
    }

    const magicWallet = getMagicWallet()

    console.log('MAGIC WALLET', magicWallet)

    if (!magicWallet) {
      const provider = new ethers.providers.Web3Provider(magic.rpcProvider)
      const signer = provider.getSigner()

      const createdRIFWallet = await RIFWallet.create(
        signer,
        request => thunkAPI.dispatch(onRequest({ request })),
        rifRelayConfig,
      )
      console.log('CREATED RIF WALLET', createdRIFWallet)
      const { rifWalletsDictionary, rifWalletsIsDeployedDictionary } =
        await createRifWalletDictionaries(createdRIFWallet)

      const decycled: Wallets = jc.decycle(rifWalletsDictionary)
      console.log('decycled', decycled)

      thunkAPI.dispatch(
        setWallets({
          wallets: decycled,
          walletsIsDeployed: rifWalletsIsDeployedDictionary,
        }),
      )
      thunkAPI.dispatch(setUnlocked(true))

      const { usdPrices } = thunkAPI.getState()

      console.log('USD PRICE IN UNLOCK WITH MAGIC', usdPrices)

      await createFetcherConnectToRifSockets(
        Object.values(rifWalletsDictionary)[0],
        thunkAPI.dispatch,
        usdPrices,
        thunkAPI.rejectWithValue,
      )
    } else {
      thunkAPI.dispatch(
        setWallets({
          wallets: magicWallet.wallets,
          walletsIsDeployed: magicWallet.walletsIsDeployed,
        }),
      )

      thunkAPI.dispatch(setUnlocked(true))
    }

    navigationContainerRef.navigate(rootTabsRouteNames.Home)
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

const magicSlice = createSlice({
  name: 'magic',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(unlockWithMagic.pending, state => {
      state.loading = true
    })
    builder.addCase(unlockWithMagic.rejected, state => {
      state.loading = false
    })
    builder.addCase(unlockWithMagic.fulfilled, state => {
      state.loading = false
    })
  },
})

export const magicSliceReducer = magicSlice.reducer
