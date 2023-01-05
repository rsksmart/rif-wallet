import { Contract, BytesLike, ContractTransaction, BigNumber, Signer } from 'ethers'
import SmartWalletABI from './SmartWalletABI.json'

const createSmartWalletContract = (address: string) => {
  return new Contract(address, SmartWalletABI)
}

export class SmartWallet {
  address: string
  smartWalletContract: Contract

  get signer (): Signer {
    return this.smartWalletContract.signer
  }

  get smartWalletAddress (): string {
    return this.smartWalletContract.address
  }

  private constructor (address: string, smartWalletContract: Contract) {
    this.address = address
    this.smartWalletContract = smartWalletContract
  }

  static async create (signer: Signer, smartWalletAddress: string) {
    const address = await signer.getAddress()
    const smartWalletContract = createSmartWalletContract(smartWalletAddress).connect(signer)
    return new SmartWallet(address, smartWalletContract)
  }

  directExecute = (to: string, data: BytesLike, ...args: any): Promise<ContractTransaction> => this.smartWalletContract.directExecute(to, data, ...args)
  estimateDirectExecute = (to: string, data: BytesLike, ...args: any): Promise<BigNumber> => this.smartWalletContract.estimateGas.directExecute(to, data, ...args)
  callStaticDirectExecute = async (to: string, data: BytesLike, ...args: any): Promise<any> => {
    const { success, ret }: { success: boolean, ret: string } = await this.smartWalletContract.callStatic.directExecute(to, data, ...args)
    if (!success) throw new Error(ret)
    return ret
  }

  nonce = async (): Promise<BigNumber> => this.smartWalletContract.nonce()
}
