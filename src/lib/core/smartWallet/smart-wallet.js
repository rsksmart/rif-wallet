import { Contract } from 'ethers'
import SmartWalletFactoryABI from './SmartWalletABI'

const createSmartWalletContract = address =>
  new Contract(address, SmartWalletFactoryABI)

export class SmartWallet {
  constructor(address, signer) {
    this.smartWallet = createSmartWalletContract(address).connect(signer)
  }

  directExecute = (to, data) => this.smartWallet.directExecute(to, data)
}
