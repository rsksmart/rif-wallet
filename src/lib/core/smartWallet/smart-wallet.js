import { Contract } from 'ethers'
import SmartWalletFactoryABI from './SmartWalletABI'

const createSmartWalletContract = address =>
  new Contract(address, SmartWalletFactoryABI)

export class SmartWallet {
  constructor(address, signer) {
    this.smartWalletContract = createSmartWalletContract(address).connect(signer)
  }

  directExecute = (to, data, ...params) => this.smartWalletContract.directExecute(to, data, ...params)
}
