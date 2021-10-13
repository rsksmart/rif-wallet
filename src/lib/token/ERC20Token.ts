import { BigNumber, BigNumberish, ContractTransaction, Signer } from 'ethers'
import {
  BaseToken,
  IToken,
  ITransferOptions,
  tenPow,
  TokenType,
} from './BaseToken'
import { ERC20 as ERC20Type, ERC20__factory } from './types'

class ERC20Token extends BaseToken implements IToken {
  private tokenContract: ERC20Type

  constructor(address: string, signer: Signer, logo: string) {
    super(signer, logo)
    this.tokenContract = ERC20__factory.connect(address, signer)
  }

  public getType(): TokenType {
    return 'erc20'
  }

  public async decimals(): Promise<number> {
    return this.tokenContract.decimals()
  }

  public async symbol(): Promise<string> {
    return this.tokenContract.symbol()
  }

  public async balance(): Promise<BigNumber> {
    const account = await this.getAddress()

    const decimals = await this.decimals()

    const balance = await this.tokenContract.balanceOf(account)

    return balance.div(tenPow(decimals))
  }

  public async transfer(
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ): Promise<ContractTransaction> {
    return this.tokenContract.transfer(recipientAddress, amount, options ?? {})
  }
}

export { ERC20Token }
