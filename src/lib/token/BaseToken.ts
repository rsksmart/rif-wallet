import { BigNumber, BigNumberish, Signer, ContractTransaction } from 'ethers'

export type TokenType = 'erc20' | 'rbtc'

export class BaseToken {
  public signer: Signer
  public logo: string

  constructor(signer: Signer, logo: string) {
    this.signer = signer
    this.logo = logo
  }

  protected async getAddress() {
    return await this.signer.getAddress()
  }
}

export interface ITransferOptions {
  gasPrice: BigNumberish
  gasLimit: BigNumberish
  nonce: BigNumberish
}

export interface IToken {
  getType: () => TokenType
  decimals: () => Promise<number>
  symbol: () => Promise<string>
  balance: () => Promise<BigNumber>
  transfer: (
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ) => Promise<ContractTransaction>
  logo: string
}

export const ten = BigNumber.from(10)
export const tenPow = (exp: BigNumberish) => ten.pow(exp)
