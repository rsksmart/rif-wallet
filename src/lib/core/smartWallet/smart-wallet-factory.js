import { Contract, constants } from 'ethers'
import SmartWalletFactoryABI from './SmartWalletFactoryABI'

const smartWalletFactoryTestnetAddress =
  '0x3f71ce7bd7912bf3b362fd76dd34fa2f017b6388'
const smartWalletFactoryContract = new Contract(
  smartWalletFactoryTestnetAddress,
  SmartWalletFactoryABI,
)

export class SmartWalletFactory {
  constructor(signer) {
    this.smartWalletFactory = smartWalletFactoryContract.connect(signer)
  }

  async getSmartWalletParams() {
    return [
      await this.smartWalletFactory.signer.getAddress(),
      constants.AddressZero,
      constants.Zero,
    ]
  }

  getSmartAddress = async () =>
    this.smartWalletFactory.getSmartWalletAddress(
      ...(await this.getSmartWalletParams()),
    )
  getCodeInSmartWallet = async () =>
    this.smartWalletFactory.signer.provider.getCode(
      await this.getSmartAddress(),
    )
  createSmartWallet = () =>
    this.smartWalletFactory.selfCreateUserSmartWallet(
      constants.AddressZero,
      constants.Zero,
    )
}

/**
 * case 1: you want to send tokens direct send
 *   -> you need to create on your own (with sc tunned)
 * case 2: you want to send tokens relayed
 *   -> relay is creating your smart wallet
 */
