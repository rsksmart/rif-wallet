import { Wallet, Contract, BytesLike, ContractTransaction, BigNumber, constants } from 'ethers'
import SmartWalletABI from './SmartWalletABI.json'

const createSmartWalletContract = (address: string) => {
  return new Contract(address, SmartWalletABI)
}

export class SmartWallet {
  smartWalletContract: Contract

  get wallet (): Wallet {
    return this.smartWalletContract.signer as Wallet
  }

  get address (): string {
    return this.wallet.address
  }

  get smartWalletAddress (): string {
    return this.smartWalletContract.address
  }

  private constructor (smartWalletContract: Contract) {
    this.smartWalletContract = smartWalletContract
  }

  static create (wallet: Wallet, smartWalletAddress: string) {
    const smartWalletContract = createSmartWalletContract(smartWalletAddress).connect(wallet)
    return new SmartWallet(smartWalletContract)
  }

  directExecute = (to: string, data: BytesLike = constants.HashZero, ...args: any): Promise<ContractTransaction> => this.smartWalletContract.directExecute(to, data, ...args)
  estimateDirectExecute = (to: string, data: BytesLike, ...args: any): Promise<BigNumber> => this.smartWalletContract.estimateGas.directExecute(to, data, ...args)
  callStaticDirectExecute = async (to: string, data: BytesLike, ...args: any): Promise<any> => {
    const { success, ret }: { success: boolean, ret: string } = await this.smartWalletContract.callStatic.directExecute(to, data, ...args)
    if (!success) throw new Error(ret)
    return ret
  }
}
