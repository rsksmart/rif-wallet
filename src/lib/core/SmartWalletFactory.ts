import { Contract, constants, ContractTransaction, Signer, ethers } from 'ethers'
import SmartWalletFactoryABI from './SmartWalletFactoryABI.json'

interface ISmartWalletFactory {
  getSmartWalletAddress(): Promise<string>

  isDeployed(): Promise<boolean>
  deploy(owner: string): Promise<ContractTransaction>
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
    const smartWalletAddress = await smartWalletFactoryContract.getSmartWalletAddress(...SmartWalletFactory.getSmartWalletParams(address))
    return new SmartWalletFactory(smartWalletAddress, smartWalletFactoryContract)
  }

  // deployment
  getSmartWalletAddress = (): Promise<string> => Promise.resolve(this.smartAddress)

  isDeployed = (): Promise<boolean> => this.smartWalletFactoryContract.signer.provider!.getCode(this.smartAddress).then(code => code !== '0x')

  deploy = async (owner: string): Promise<ContractTransaction> => {

    const toSign: string = ethers.utils.solidityKeccak256(
      ['bytes2','address','address','uint256'], ['0x1910', owner, constants.AddressZero, constants.Zero]
    )

    const toSignAsBinaryArray = ethers.utils.arrayify(toSign)
    //@ts-ignore
    const privateKey = this.smartWalletFactoryContract.signer.privateKey
    const signingKey = new ethers.utils.SigningKey(privateKey)
    const signature = signingKey.signDigest(toSignAsBinaryArray)
    const signatureCollapsed = ethers.utils.joinSignature(signature)
    return this.smartWalletFactoryContract.createUserSmartWallet(
    owner,
    constants.AddressZero,
    constants.Zero,
    signatureCollapsed
  )
  }
}
