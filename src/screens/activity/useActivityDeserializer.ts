import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { BigNumber } from 'ethers'
import { t } from 'i18next'

import {
  balanceToDisplay,
  convertBalance,
  convertUnixTimeToFromNowFormat,
} from 'lib/utils'

import { UsdPricesState } from 'store/slices/usdPricesSlice'
import { isDefaultChainTypeMainnet } from 'src/core/config'

import { ActivityRowPresentationObjectType, ActivityMixedType } from './types'

const useActivityDeserializer: (
  activityTransaction: ActivityMixedType,
  prices: UsdPricesState,
  wallet: RIFWallet,
) => ActivityRowPresentationObjectType = (
  activityTransaction,
  prices,
  wallet,
) => {
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
      fee: 0,
      total: activityTransaction.valueBtc,
    }
  } else {
    const tx = activityTransaction.originTransaction
    const rbtcAddress = '0x0000000000000000000000000000000000000000'
    const status = tx.receipt ? 'success' : 'pending'
    const timeFormatted = convertUnixTimeToFromNowFormat(tx.timestamp)
    const { address: tokenAddress, data: balance } =
      tx.txType === 'contract call'
        ? tx.receipt?.logs.filter(log =>
            log.topics.find(topic => {
              return topic
                .toLowerCase()
                .includes(wallet.smartWalletAddress.substring(2).toLowerCase())
            }),
          )[0] || { address: '', data: '0x0' }
        : { address: rbtcAddress, data: tx.value }
    if (!tokenAddress || tokenAddress === rbtcAddress) {
      return {
        symbol: tokenAddress
          ? 'RBTC'
          : (activityTransaction?.enhancedTransaction?.symbol as string) || '',
        to: tx.to,
        timeHumanFormatted: timeFormatted,
        status,
        value:
          activityTransaction.enhancedTransaction?.value ||
          balanceToDisplay(tx.value, 18),
        id: tx.hash,
        price: tokenAddress
          ? convertBalance(
              tx.value,
              18,
              tokenAddress ? prices[tokenAddress].price : 0,
            )
          : 0,
        fee: balanceToDisplay(tx.gas, 18),
        total: balanceToDisplay(
          BigNumber.from(tx.gas).add(BigNumber.from(tx.value)),
          18,
        ),
      }
    }
    const contracts = isDefaultChainTypeMainnet
      ? mainnetContracts
      : testnetContracts
    const key = Object.keys(contracts).find(
      address => address.toLowerCase() === tokenAddress.toLowerCase(),
    )
    const token = key ? contracts[key] : { decimals: 18, symbol: '' }
    return {
      symbol:
        (activityTransaction?.enhancedTransaction?.symbol as string) ||
        token.symbol,
      to: activityTransaction.originTransaction.to,
      timeHumanFormatted: timeFormatted,
      status,
      value: balanceToDisplay(balance, token.decimals),
      id: activityTransaction.originTransaction.hash,
      price: convertBalance(
        balance,
        token.decimals,
        tokenAddress ? prices[tokenAddress].price : 0,
      ),
      fee: balanceToDisplay(tx.gas, 18),
      total: balanceToDisplay(balance, token.decimals),
    }
  }
}

export default useActivityDeserializer
