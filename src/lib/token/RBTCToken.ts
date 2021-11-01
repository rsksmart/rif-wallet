import {
  BigNumber,
  BigNumberish,
  constants,
  ContractTransaction,
  Signer,
} from 'ethers'
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken'

class RBTCToken extends BaseToken implements IToken {
  public chainId: number
  public address: string

  constructor(signer: Signer, symbol: string, logo: string, chainId: number) {
    super(signer, symbol, logo)

    this.chainId = chainId
    this.address = constants.AddressZero
  }

  public getType(): TokenType {
    return 'rbtc'
  }

  public async decimals(): Promise<number> {
    return 18
  }

  public async balance(): Promise<BigNumber> {
    return this.signer.getBalance()
  }

  public async transfer(
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ): Promise<ContractTransaction> {
    const account = await this.getAccountAddress()

    return this.signer.sendTransaction({
      from: account,
      to: recipientAddress,
      value: amount,
      ...options,
    })
  }
}

export { RBTCToken }
