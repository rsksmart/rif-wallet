import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import { BigNumber } from 'ethers'

import { UsdPricesState } from 'src/redux/slices/usdPricesSlice'

import { ActivityRowPresentationObjectType, ActivityMixedType } from './types'
import {
  balanceToDisplay,
  convertBalance,
  convertUnixTimeToFromNowFormat,
} from '../../lib/utils'

const useActivityDeserializer: (
  activityTransaction: ActivityMixedType,
  prices: UsdPricesState,
) => ActivityRowPresentationObjectType = (activityTransaction, prices) => {
  if ('isBitcoin' in activityTransaction) {
    return {
      symbol: activityTransaction.symbol,
      to: activityTransaction.to,
      value: activityTransaction.valueBtc,
      timeHumanFormatted: convertUnixTimeToFromNowFormat(
        activityTransaction.blockTime,
      ),
      status: activityTransaction.status,
      id: activityTransaction.txid,
      price: convertBalance(
        BigNumber.from(Math.round(Number(activityTransaction.valueBtc) * 10e8)),
        8,
        prices.BTC?.price || 0,
      ),
    }
  } else {
    const status = activityTransaction.originTransaction.receipt
      ? 'success'
      : 'pending'
    const timeFormatted = convertUnixTimeToFromNowFormat(
      activityTransaction.originTransaction.timestamp,
    )
    const tx = activityTransaction.originTransaction
    const tokenAdress =
      tx.receipt && tx.receipt.logs.length
        ? tx.receipt.logs[0].address
        : '0x0000000000000000000000000000000000000000'
    const token = testnetContracts[
      Object.keys(testnetContracts).find(
        address => address.toLowerCase() === tokenAdress,
      ) || ''
    ] || { decimals: 18, symbol: 'RBTC' }
    const balance =
      activityTransaction.originTransaction.receipt &&
      activityTransaction.originTransaction.receipt.logs.length
        ? activityTransaction.originTransaction.receipt.logs[0].args[2]
        : activityTransaction.originTransaction.value
    const valueConverted = () => {
      if (
        activityTransaction.originTransaction.receipt &&
        activityTransaction.originTransaction.receipt.logs.length
      ) {
        return balanceToDisplay(
          activityTransaction.originTransaction.receipt.logs[0].args[2],
          token.decimals,
        )
      }
      if (activityTransaction.enhancedTransaction?.value) {
        return balanceToDisplay(
          activityTransaction.enhancedTransaction.value,
          token.decimals,
        )
      }
      return balanceToDisplay(
        activityTransaction.originTransaction.value,
        token.decimals,
      )
    }
    return {
      symbol:
        (activityTransaction?.enhancedTransaction?.symbol as string) ||
        token.symbol,
      to: activityTransaction.originTransaction.to,
      timeHumanFormatted: timeFormatted,
      status,
      value: valueConverted(),
      id: activityTransaction.originTransaction.hash,
      price: convertBalance(balance, token.decimals, prices[tokenAdress].price),
    }
  }
}

export default useActivityDeserializer
