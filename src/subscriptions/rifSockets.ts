import EventEmitter from 'eventemitter3'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import {
  ITokenWithBalance,
  RifWalletServicesFetcher,
  RifWalletServicesSocket,
} from '@rsksmart/rif-wallet-services'
import { Options, setInternetCredentials } from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info'

import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AppDispatch } from 'store/index'
import { abiEnhancer, getDefaultTokens } from 'core/setup'
import { addOrUpdateBalances } from 'store/slices/balancesSlice'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import { UsdPricesState } from 'store/slices/usdPricesSlice'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { MMKVStorage } from 'storage/MMKVStorage'
import { enhanceTransactionInput } from 'screens/activity/ActivityScreen'
import { filterEnhancedTransactions } from 'src/subscriptions/utils'
import {
  chainTypesById,
  ChainTypesByIdType,
} from 'shared/constants/chainConstants'

import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { Action, InitAction } from './types'

export const socketsEvents = new EventEmitter()

export enum SocketsEvents {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

interface RifSockets {
  wallet: RIFWallet
  setGlobalError: (err: string) => void
  dispatch: AppDispatch
  usdPrices: UsdPricesState
  fetcher: RifWalletServicesFetcher
  chainId: ChainTypesByIdType
  balances: Record<string, TokenBalanceObject>
}

const onSocketInit = (
  payload: InitAction['payload'],
  cb: (action: Action) => void,
) => {
  cb({ type: 'init', payload })
}

export const rifSockets = ({
  wallet,
  fetcher,
  dispatch,
  setGlobalError,
  usdPrices,
  chainId,
  balances,
}: RifSockets) => {
  const onChange = onSocketChangeEmitted({
    dispatch,
    abiEnhancer,
    wallet,
    usdPrices,
    chainId,
  })
  const rifWalletServicesSocket = new RifWalletServicesSocket<
    Options,
    ReturnType<typeof setInternetCredentials>
  >(
    getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, chainTypesById[chainId]),
    abiEnhancer,
    {
      cache: new MMKVStorage('temp'),
      encryptionKeyMessageToSign: getWalletSetting(
        SETTINGS.RIF_WALLET_KEY,
        chainTypesById[chainId],
      ),
      onEnhanceTransaction: enhanceTransactionInput,
      onFilterOutRepeatedTransactions: filterEnhancedTransactions,
      onBeforeInit: (encryptionKey, currentInstance) => {
        currentInstance.cache = new MMKVStorage('txs', encryptionKey)
      },
    },
    {
      cacheBlockNumberText: `blockNumber_${chainId}`,
      cacheTxsText: `cachedTxs_${chainId}`,
    },
  )

  const connectSocket = () => {
    if (rifWalletServicesSocket.isConnected()) {
      rifWalletServicesSocket.disconnect()
      dispatch(resetSocketState())
    }

    const defaultTokens = getDefaultTokens(chainId)
    const defaultTokensWithBalance = defaultTokens.map(t => {
      const tokenBalance = balances[t.contractAddress]
      return {
        ...t,
        logo: '', // remove warning
        balance: tokenBalance?.balance ?? t.balance,
        usdBalance: tokenBalance?.usdBalance ?? t.usdBalance,
      } as ITokenWithBalance
    })
    dispatch(addOrUpdateBalances(defaultTokensWithBalance))

    rifWalletServicesSocket.removeAllListeners()

    rifWalletServicesSocket.on('init', payload =>
      onSocketInit(payload, onChange),
    )
    rifWalletServicesSocket.on('change', onChange)
    rifWalletServicesSocket
      .connect(wallet, fetcher, { 'User-Agent': DeviceInfo.getUserAgentSync() })
      .catch(err => {
        if (err instanceof Error) {
          setGlobalError(err.message)
        } else {
          setGlobalError('Error connecting to socket')
        }
      })
  }

  const disconnectSocket = rifWalletServicesSocket.disconnect

  socketsEvents.removeAllListeners()

  socketsEvents.on(SocketsEvents.CONNECT, connectSocket)

  socketsEvents.on(SocketsEvents.DISCONNECT, disconnectSocket)
}
