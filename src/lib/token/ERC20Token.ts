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
import { ERC20 as ERC20Type, ERC20__factory } from './types'

class ERC20Token extends BaseToken implements IToken {
  private tokenContract: ERC20Type

  constructor(
    address: string,
    providerOrSigner: providers.Provider | Signer,
    logo: string,
  ) {
    super(providerOrSigner, logo)
    this.tokenContract = ERC20__factory.connect(address, providerOrSigner)
  }

  public getType(): TokenType {
    return 'erc20'
  }

  public async approve(
    address: string,
    amount: BigNumberish,
  ): Promise<ContractTransaction> {
    return this.tokenContract.approve(address, amount)
  }

  public async needsApproval(
    address: string,
    amount: BigNumberish,
  ): Promise<boolean> {
    const signerAddress = await this.signer!.getAddress()
    const allowance = await this.tokenContract.allowance(signerAddress, address)

    const hasEnoughAllowance = allowance.gte(amount)

    return !hasEnoughAllowance
  }

  public async decimals(): Promise<number> {
    return this.tokenContract.decimals()
  }

  public async symbol(): Promise<string> {
    return this.tokenContract.symbol()
  }

  public async balance(): Promise<BigNumber> {
    const account = await this.account()

    const decimals = await this.decimals()

    const balance = await this.tokenContract.balanceOf(account)

    return balance.div(tenPow(decimals))
  }

  public async allowance(expenderAddress: string): Promise<BigNumber> {
    const account = await this.account()

    return this.tokenContract.allowance(account, expenderAddress)
  }

  public async transfer(
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ): Promise<ContractTransaction> {
    const account = await this.account()

    return this.tokenContract.transferFrom(
      account,
      recipientAddress,
      amount,
      options,
    )
  }
}

export { ERC20Token }
