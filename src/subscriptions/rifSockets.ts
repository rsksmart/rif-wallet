import EventEmitter from 'eventemitter3'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'
import { Options, setInternetCredentials } from 'react-native-keychain'

import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AppDispatch } from 'store/index'
import { rifWalletServicesSocket, abiEnhancer, defaultTokens } from 'core/setup'
import { addOrUpdateBalances } from 'store/slices/balancesSlice'
import { UsdPricesState } from 'store/slices/usdPricesSlice'

import { Action, InitAction } from './types'
import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { addNewTransactions } from 'src/redux/slices/transactionsSlice'

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
  fetcher: RifWalletServicesFetcher<
    Options,
    ReturnType<typeof setInternetCredentials>
  >
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
}: RifSockets) => {
  const onChange = onSocketChangeEmitted({
    dispatch,
    abiEnhancer,
    wallet,
    usdPrices,
  })

  const connectSocket = () => {
    if (rifWalletServicesSocket.isConnected()) {
      rifWalletServicesSocket.disconnect()
      dispatch(resetSocketState())
    }

    dispatch(addOrUpdateBalances(defaultTokens))

    rifWalletServicesSocket.removeAllListeners()

    rifWalletServicesSocket.on('init', payload =>
      onSocketInit(payload, onChange),
    )
    rifWalletServicesSocket.on('change', onChange)
    rifWalletServicesSocket.connect(wallet, fetcher).catch(err => {
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
