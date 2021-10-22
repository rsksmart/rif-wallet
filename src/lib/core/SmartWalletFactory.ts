import { Wallet, Contract, constants, ContractTransaction } from 'ethers'
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

  static async create (wallet: Wallet, smartWalletFactoryContractAddress: string) {
    const smartWalletFactoryContract = createSmartWalletFactoryContract(smartWalletFactoryContractAddress).connect(wallet)
    const smartAddress = await smartWalletFactoryContract.getSmartWalletAddress(...SmartWalletFactory.getSmartWalletParams(wallet.address))
    return new SmartWalletFactory(smartAddress, smartWalletFactoryContract)
  }

  // deployment
  getSmartWalletAddress = (): Promise<string> => Promise.resolve(this.smartAddress)

  isDeployed = (): Promise<boolean> => this.smartWalletFactoryContract.signer.provider!.getCode(this.smartAddress).then(code => code !== '0x')

  deploy = (): Promise<ContractTransaction> => this.smartWalletFactoryContract.selfCreateUserSmartWallet(
    constants.AddressZero,
    constants.Zero
  )
}
