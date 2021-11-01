import { BigNumber, constants, Signer } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { formatBigNumber } from '../formatBigNumber'
import { IEnhancedResult, IEnhanceStrategy } from '../AbiEnhancer'
import { makeRBTCToken } from '../../../lib/token/tokenMetadata'

export class RBTCEnhanceStrategy implements IEnhanceStrategy {
  public async parse(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null> {
    const chainId = await signer.getChainId()

    const rbtc = makeRBTCToken(signer, chainId)

    const currentBalance = await rbtc.balance()
    const decimals = await rbtc.decimals()

    console.log('currentBalance', currentBalance)

    return {
      from: transactionRequest.from!,
      to: transactionRequest.to!,
      balance: formatBigNumber(currentBalance, decimals),
      value: formatBigNumber(
        BigNumber.from(transactionRequest.value),
        decimals,
      ),
      symbol: 'tRBTC'
    }
  }
}
