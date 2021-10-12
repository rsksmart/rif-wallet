import {
  BigNumber,
  BigNumberish,
  providers,
  Signer,
  ContractTransaction,
} from 'ethers'

export type TokenType = 'erc20' | 'rbtc'

export class BaseToken {
  get signer(): Signer | null {
    return Signer.isSigner(this.providerOrSigner) ? this.providerOrSigner : null
  }

  get provider(): providers.Provider {
    return Signer.isSigner(this.providerOrSigner)
      ? this.providerOrSigner.provider!
      : this.providerOrSigner
  }

  constructor(
    public providerOrSigner: providers.Provider | Signer,
    public logo: string,
  ) {}

  protected async account() {
    return await this.signer!.getAddress()
  }
}

export interface ITransferOptions {
  gasPrice: BigNumberish
  gasLimit: BigNumberish
  nonce: BigNumberish
}

export interface IToken {
  getType: () => TokenType
  approve: (
    address: string,
    amount: BigNumberish,
  ) => Promise<ContractTransaction>
  needsApproval: (address: string, amount: BigNumberish) => Promise<boolean>
  decimals: () => Promise<number>
  symbol: () => Promise<string>
  balance: () => Promise<BigNumber>
  allowance: (expenderAddress: string) => Promise<BigNumber>
  transfer: (
    recipientAddress: string,
    amount: BigNumberish,
    options?: ITransferOptions,
  ) => Promise<ContractTransaction>
  logo: string
}

export const ten = BigNumber.from(10)
export const tenPow = (exp: BigNumberish) => ten.pow(exp)
