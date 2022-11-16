import { IRifWalletServicesSocket } from '../lib/rifWalletServices/RifWalletServicesSocket'
import { RIFWallet } from '../lib/core'
import { IChangeEmittedFunction } from './types'

interface IUseConnectSocket {
  rifServiceSocket?: IRifWalletServicesSocket
  onInit: (result: any) => void
  onChange: ({}: IChangeEmittedFunction) => void
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
    rifServiceSocket?.on('change', onChange)
    rifServiceSocket?.connect(wallet, mnemonic!).catch(onError)
  }
}
