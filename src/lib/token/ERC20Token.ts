import { BigNumber, BigNumberish, ContractTransaction, Signer } from 'ethers'
import { BaseToken, IToken, ITransferOptions, TokenType } from './BaseToken'
import { ERC20 as ERC20Type, ERC20__factory } from './types'

class ERC20Token extends BaseToken implements IToken {
  private tokenContract: ERC20Type

  public address: string

  constructor(address: string, signer: Signer, symbol: string, logo: string) {
    super(signer, symbol, logo)
    this.tokenContract = ERC20__factory.connect(address, signer)
    this.address = address
  }

  public getType(): TokenType {
    return 'erc20'
  }

  public async decimals(): Promise<number> {
    return this.tokenContract.decimals()
  }

  public async balance(): Promise<BigNumber> {
    const account = await this.getAccountAddress()

    return this.tokenContract.balanceOf(account)
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
