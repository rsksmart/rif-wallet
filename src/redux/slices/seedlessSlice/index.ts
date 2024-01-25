import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import { Wallet } from 'shared/wallet'
import { AsyncThunkWithTypes } from 'store/store'
import { createMagicWalletWithEmail } from 'shared/utils'

import { EmailLogin, SeedlessState } from './types'
import { initializeApp, onRequest, setUnlocked } from '../settingsSlice'

export const loginWithEmail = createAsyncThunk<
  Wallet,
  EmailLogin,
  AsyncThunkWithTypes
>('seedless/seedlessEmailLogin', async (payload, thunkAPI) => {
  try {
    const {
      settings: { chainId },
      usdPrices,
      balances,
    } = thunkAPI.getState()
    const { email, initializeWallet, magic } = payload

    const wallet = await createMagicWalletWithEmail(email, magic, request =>
      thunkAPI.dispatch(onRequest({ request })),
    )

    //@TODO: when MagicRelay is added
    // this ts error will be fixed
    const result = await wallet?.loginWithEmail(email)

    if (!result) {
      return thunkAPI.rejectWithValue('No DID Token was created!')
    }

    initializeWallet(wallet!, {
      isDeployed: await wallet!.isDeployed,
      txHash: null,
      loading: false,
    })

    thunkAPI.dispatch(setUnlocked(true))

    await initializeApp(
      '',
      wallet!,
      chainId,
      usdPrices,
      balances,
      thunkAPI.dispatch,
      thunkAPI.rejectWithValue,
    )

    // return wallet
  } catch (err) {
    return thunkAPI.rejectWithValue(err)
  }
})

const initialState: SeedlessState = {
  loading: false,
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(loginWithEmail.pending, state => {
      state.loading = true
    })
    builder.addCase(loginWithEmail.rejected, state => {
      state.loading = false
    })
    builder.addCase(loginWithEmail.fulfilled, state => {
      state.loading = false
    })
  },
})

export const {} = settingsSlice.actions

export const seedlessSliceReducer = settingsSlice.reducer

export * from './selectors'
