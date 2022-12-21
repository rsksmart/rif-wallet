import { ERC20__factory } from 'lib/token/types'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { getAllTokens } from 'lib/token/tokenMetadata'
import { Signer } from '@ethersproject/abstract-signer'
import { formatBigNumber } from '../formatBigNumber'
import { EnhancedResult, EnhanceStrategy } from '../AbiEnhancer'
import { ERC20Token } from 'lib/token/ERC20Token'
import { BigNumber } from '@ethersproject/bignumber'

export class ERC20EnhanceStrategy implements EnhanceStrategy {
  public async parse(
    signer: Signer,
    transactionRequest: TransactionRequest,
  ): Promise<EnhancedResult | null> {
    if (!transactionRequest.data) {
      return null
    }

    const tokens = await getAllTokens(signer)
    // TODO: mixed up logic, needs refactor
    const tokenFounded = tokens.find(
      x => x.address.toLowerCase() === transactionRequest.to?.toLowerCase(),
    ) as ERC20Token

    if (!tokenFounded) {
      return null
    }

    const abiErc20Interface = ERC20__factory.createInterface()

    let resultTo = transactionRequest.to
    let resultValue = transactionRequest.value

    try {
      const [decodedTo, decodedValue] = abiErc20Interface.decodeFunctionData(
        'transfer',
        transactionRequest.data,
      )
      resultTo = decodedTo
      resultValue = decodedValue
    } catch (error) {}

    const currentBalance = await tokenFounded.balance()
    const tokenDecimals = await tokenFounded.decimals()
    const tokenSymbol = tokenFounded.symbol

    return {
      ...transactionRequest,
      to: resultTo,
      symbol: tokenSymbol,
      balance: formatBigNumber(currentBalance, tokenDecimals),
      value: formatBigNumber(BigNumber.from(resultValue ?? 0), tokenDecimals),
    }
  }
}
