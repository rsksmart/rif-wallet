import { ERC20__factory } from '../../token/types'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { getAllTokens } from '../../token/tokenMetadata'
import { Signer } from '@ethersproject/abstract-signer'
import { formatBigNumber } from '../formatBigNumber'
import { IEnhancedResult, IEnhanceStrategy } from '../AbiEnhancer'
import { ERC20Token } from '../../token/ERC20Token'

export class ERC20EnhanceStrategy implements IEnhanceStrategy {
  public async parse(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<IEnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const tokens = await getAllTokens(signer)
    // TODO: mixed up logic, needs refactor
    const tokenFounded = tokens.find(
      x => x.address === transactionRequest.to,
    ) as ERC20Token

    if (!tokenFounded) {
      return null
    }

    const abiErc20Interface = ERC20__factory.createInterface()

    const [decodedTo, decodedValue] = abiErc20Interface.decodeFunctionData(
      'transfer',
      transactionRequest.data,
    )

    const currentBalance = await tokenFounded.balance()
    const tokenDecimals = await tokenFounded.decimals()
    const tokenSymbol = tokenFounded.symbol

    return {
      from: transactionRequest.from!,
      to: decodedTo,
      symbol: tokenSymbol,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      value: formatBigNumber(decodedValue, tokenDecimals),
    }
  }
}
