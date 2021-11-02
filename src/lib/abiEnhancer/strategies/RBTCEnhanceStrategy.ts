import { BigNumber, Signer } from 'ethers'
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
    const tokenDecimals = await rbtc.decimals()
    const symbol = rbtc.symbol

    return {
      from: transactionRequest.from!,
      to: transactionRequest.to!,
      symbol,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      value: formatBigNumber(
        BigNumber.from(transactionRequest.value),
        tokenDecimals,
      ),
    }
  }
}
