import EventEmitter from 'eventemitter3'

import { RIFWallet } from 'lib/core'
import { RifWalletServicesFetcher } from '@rsksmart/rif-wallet-services'

import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AppDispatch } from 'store/index'
import { rifWalletServicesSocket, abiEnhancer } from 'core/setup'
import { Action, InitAction } from './types'

export const socketsEvents = new EventEmitter()

export enum SocketsEvents {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

interface RifSockets {
  wallet: RIFWallet
  mnemonic: string
  setGlobalError: (err: string) => void
  dispatch: AppDispatch
  fetcher: RifWalletServicesFetcher
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
}: RifSockets) => {
  const onChange = onSocketChangeEmitted({
    dispatch,
    abiEnhancer,
    wallet,
  })

  const connectSocket = () => {
    if (rifWalletServicesSocket.isConnected()) {
      rifWalletServicesSocket.disconnect()
      dispatch(resetSocketState())
    }

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
