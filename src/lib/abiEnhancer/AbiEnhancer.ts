import { TransactionRequest } from '@ethersproject/abstract-provider'
import { Signer } from '@ethersproject/abstract-signer'
import { ERC20EnhanceStrategy } from './strategies/ERC20EnhanceStrategy'

export interface IEnhancedResult {
  from: string
  to: string
  balance: string
  value: string
}

export interface IEnhanceStrategy {
  parse: (
    signer: Signer,
    transactionRequest: TransactionRequest,
  ) => Promise<IEnhancedResult | null>
}

class AbiEnhancer {
  public strategies: IEnhanceStrategy[]

  constructor() {
    this.strategies = [new ERC20EnhanceStrategy()]
  }

  public async enhance(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null> {
    for (const strategy of this.strategies) {
      const result = strategy.parse(signer, transactionRequest)

      if (result) {
        return result
      }
    }

    return null
  }
}

export default AbiEnhancer
