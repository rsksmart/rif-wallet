import {
  BigNumber,
  BigNumberish,
  ContractTransaction,
  providers,
  Signer,
} from 'ethers'
import {
  BaseToken,
  IToken,
  ITransferOptions,
  tenPow,
  TokenType,
} from './BaseToken'

class RBTCToken extends BaseToken implements IToken {
  constructor(providerOrSigner: providers.Provider | Signer, logo: string) {
    super(providerOrSigner, logo)
  }

  public getType(): TokenType {
    return 'rbtc'
  }

  public async approve(): Promise<ContractTransaction> {
    throw new Error("This token doesn't requires approval")
  }

  public async needsApproval(): Promise<boolean> {
    return false
  }

  public async decimals(): Promise<number> {
    return 18
  }

  public async symbol(): Promise<string> {
    return 'RBTC'
  }

  public async balance(): Promise<BigNumber> {
    const decimals = await this.decimals()

    const balance = await this.signer!.getBalance()

    return balance.div(tenPow(decimals))
  }

  public async allowance(): Promise<BigNumber> {
    throw new Error("This token doesn't allowance")
  }

  public async transfer(
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ): Promise<ContractTransaction> {
    const account = await this.account()

    return this.signer!.sendTransaction({
      from: account,
      to: recipientAddress,
      value: amount,
      ...options,
    })
  }
}

export { RBTCToken }
