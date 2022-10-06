import { Contract, constants, ContractTransaction, Signer } from 'ethers'
import { db } from '../../core/setup'
import { WalletSchema } from '../../storage/db/RealmDb'
import SmartWalletFactoryABI from './SmartWalletFactoryABI.json'

interface ISmartWalletFactory {
  getSmartWalletAddress(): Promise<string>

  isDeployed(): Promise<boolean>
  deploy(): Promise<ContractTransaction>
}

const createSmartWalletFactoryContract = (address: string) => {
  return new Contract(address, SmartWalletFactoryABI)
}

/**
 * This is a Smart Wallet Factory contract helper for a given Wallet
 */
export class SmartWalletFactory implements ISmartWalletFactory {
  smartAddress: string
  smartWalletFactoryContract: Contract

  private constructor (smartAddress: string, smartWalletFactoryContract: Contract) {
    this.smartAddress = smartAddress
    this.smartWalletFactoryContract = smartWalletFactoryContract
  }

  private static getSmartWalletParams (address: string) {
    return [
      address,
      constants.AddressZero,
      constants.Zero
    ]
  }

  static async create (signer: Signer, smartWalletFactoryContractAddress: string) {
    const smartWalletFactoryContract = createSmartWalletFactoryContract(smartWalletFactoryContractAddress).connect(signer)
    const address = await signer.getAddress()
    if(db.has(WalletSchema.name, address)) {
      return new SmartWalletFactory(db.get(WalletSchema.name, address).value.smartWalletAddress, smartWalletFactoryContract)
    }
    // Heavy Process
    const smartWalletAddress = await smartWalletFactoryContract.getSmartWalletAddress(...SmartWalletFactory.getSmartWalletParams(address))
    db.store(WalletSchema.name, address, {smartWalletAddress, isDeployed: false})
    return new SmartWalletFactory(smartWalletAddress, smartWalletFactoryContract)
  }

  // deployment
  getSmartWalletAddress = (): Promise<string> => Promise.resolve(this.smartAddress)

  isDeployed = (): Promise<boolean> => this.smartWalletFactoryContract.signer.provider!.getCode(this.smartAddress).then(code => code !== '0x')

  deploy = (): Promise<ContractTransaction> => this.smartWalletFactoryContract.selfCreateUserSmartWallet(
    constants.AddressZero,
    constants.Zero
  )
}
