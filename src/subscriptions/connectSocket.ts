import {
  IRifWalletServicesSocket,
  IServiceChangeEvent,
  IServiceInitEvent,
} from 'lib/rifWalletServices/RifWalletServicesSocket'
import { RIFWallet } from 'lib/core'

import { Action } from 'src/subscriptions/types'
import { RifWalletServicesFetcher } from 'src/lib/rifWalletServices/RifWalletServicesFetcher'

interface ConnectSocket {
  rifServiceSocket: IRifWalletServicesSocket
  onInit: (result: IServiceInitEvent) => void
  onChange: (action: Action) => void
  onError: () => void
  wallet: RIFWallet
  fetcher?: RifWalletServicesFetcher
}

export const connectSocket = ({
  rifServiceSocket,
  onInit,
  onChange,
  onError,
  wallet,
  fetcher,
}: ConnectSocket) => {
  rifServiceSocket.on('init', onInit)
  rifServiceSocket.on(
    'change',
    onChange as (action: IServiceChangeEvent) => void,
  )
  rifServiceSocket.connect(wallet, fetcher).catch(onError)
}
