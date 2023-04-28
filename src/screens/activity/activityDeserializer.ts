import { BigNumber } from 'ethers'

import {
  balanceToDisplay,
  convertBalance,
  convertUnixTimeToFromNowFormat,
} from 'lib/utils'

import { UsdPricesState } from 'store/slices/usdPricesSlice'
import {
  defaultChainType,
  getTokenAddress,
  isDefaultChainTypeMainnet,
} from 'core/config'
import { TransactionStatus } from 'screens/transactionSummary'
import { TokenSymbol } from 'screens/home/TokenImage'

import { ActivityRowPresentationObjectType, ActivityMixedType } from './types'

export const activityDeserializer: (
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
        Math.round(Number(activityTransaction.valueBtc) * Math.pow(10, 8)),

        8,
        prices.BTC?.price || 0,
      ),
      fee: `${activityTransaction.fees} satoshi`,
      total: balanceToDisplay(
        BigNumber.from(
          Math.round(Number(activityTransaction.valueBtc) * Math.pow(10, 8)),
        ).add(BigNumber.from(Math.round(Number(activityTransaction.fees)))),
        8,
      ),
    }
  } else {
    const tx = activityTransaction.originTransaction
    const etx = activityTransaction.enhancedTransaction
    const status = tx.receipt
      ? TransactionStatus.SUCCESS
      : TransactionStatus.PENDING
    const rbtcSymbol = isDefaultChainTypeMainnet
      ? TokenSymbol.RBTC
      : TokenSymbol.TRBTC
    const rbtcAddress = '0x0000000000000000000000000000000000000000'
    const value = etx?.value || balanceToDisplay(tx.value, 18)
    let tokenAddress = ''
    try {
      tokenAddress =
        etx?.symbol === rbtcSymbol
          ? rbtcAddress
          : getTokenAddress(etx?.symbol || '', defaultChainType)
    } catch {}
    const feeRbtc = BigNumber.from(tx.gasPrice).mul(
      BigNumber.from(tx.receipt?.gasUsed || 1),
    )
    const totalToken =
      etx?.feeSymbol === etx?.symbol
        ? (Number(etx?.value) || 0) + (Number(etx?.feeValue) || 0)
        : value
    const fee =
      etx?.feeSymbol === etx?.symbol
        ? etx?.feeValue
        : `${balanceToDisplay(feeRbtc, 18)} ${rbtcSymbol}`
    const total = etx?.feeValue
      ? totalToken
      : etx?.value || balanceToDisplay(tx.value, 18)
    return {
      symbol: etx?.symbol,
      to: etx?.to,
      timeHumanFormatted: convertUnixTimeToFromNowFormat(tx.timestamp),
      status,
      id: tx.hash,
      value,
      fee,
      total,
      price:
        tokenAddress && tokenAddress.toLowerCase() in prices
          ? Number(total) * prices[tokenAddress.toLowerCase()].price
          : 0,
    }
  }
}
