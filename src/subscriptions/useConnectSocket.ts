import {
  IRifWalletServicesSocket,
  IServiceChangeEvent,
  IServiceInitEvent,
} from 'lib/rifWalletServices/RifWalletServicesSocket'
import { RIFWallet } from 'lib/core'
import { Action } from 'src/subscriptions/types'

interface IUseConnectSocket {
  rifServiceSocket?: IRifWalletServicesSocket
  onInit: (result: IServiceInitEvent) => void
  onChange: (action: Action) => void
  onError: () => void
  wallet: RIFWallet
  mnemonic?: string
}

export const useConnectSocket = ({
  rifServiceSocket,
  onInit,
  onChange,
  onError,
  wallet,
  mnemonic,
}: IUseConnectSocket) => {
  return () => {
    rifServiceSocket?.on('init', onInit)
    rifServiceSocket?.on(
      'change',
      onChange as (action: IServiceChangeEvent) => void,
    )
    mnemonic && rifServiceSocket?.connect(wallet, mnemonic).catch(onError)
  }
}
