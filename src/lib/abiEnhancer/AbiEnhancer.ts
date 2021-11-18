import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { ERC20EnhanceStrategy } from './strategies/ERC20EnhanceStrategy'
import { OtherEnhanceStrategy } from './strategies/OtherEnhanceStrategy'
import { RBTCEnhanceStrategy } from './strategies/RBTCEnhanceStrategy'

export interface IEnhancedResult {
  from?: string
  to?: string
  [key: string]: any
}

export interface IEnhanceStrategy {
  parse: (
    signer: Signer,
    transactionRequest: TransactionRequest,
  ) => Promise<IEnhancedResult | null>
}

export interface IAbiEnhancer {
  enhance(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null>
}

export class AbiEnhancer implements IAbiEnhancer {
  public strategies: IEnhanceStrategy[]

  constructor() {
    this.strategies = [
      new ERC20EnhanceStrategy(),
      new OtherEnhanceStrategy(),
      new RBTCEnhanceStrategy(),
    ]
  }

  public async enhance(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null> {
    for (const strategy of this.strategies) {
      const result = await strategy.parse(signer, transactionRequest)

      if (result) {
        return result
      }
    }

    return null
  }
}
