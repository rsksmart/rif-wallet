import { BigNumber, BigNumberish, ContractTransaction, Signer } from 'ethers'
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken'

class RBTCToken extends BaseToken implements IToken {
  public chainId: number

  constructor(signer: Signer, symbol: string, logo: string, chainId: number) {
    super(signer, symbol, logo)

    this.chainId = chainId
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
    const account = await this.getAddress()

    return this.signer.sendTransaction({
      from: account,
      to: recipientAddress,
      value: amount,
      ...options,
    })
  }
}

export { RBTCToken }
