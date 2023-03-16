import testnetContracts from '@rsksmart/rsk-testnet-contract-metadata'
import mainnetContracts from '@rsksmart/rsk-contract-metadata'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { BigNumber } from 'ethers'

import {
  balanceToDisplay,
  convertBalance,
  convertUnixTimeToFromNowFormat,
} from 'lib/utils'

import { UsdPricesState } from 'store/slices/usdPricesSlice'
import { isDefaultChainTypeMainnet } from 'core/config'
import { TransactionStatus } from 'src/screens/transactionSummary'
import { TokenSymbol } from 'src/screens/home/TokenImage'

import { ActivityRowPresentationObjectType, ActivityMixedType } from './types'

enum TxType {
  NORMAL = 'normal',
  CONTRACT_CALL = 'contract call',
}

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
        BigNumber.from(
          Math.round(Number(activityTransaction.valueBtc) * Math.pow(10, 8)),
        ),
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
    const rbtcAddress = '0x0000000000000000000000000000000000000000'
    const rbtcSymbol = isDefaultChainTypeMainnet
      ? TokenSymbol.RBTC
      : TokenSymbol.TRBTC
    const status = tx.receipt
      ? TransactionStatus.SUCCESS
      : TransactionStatus.PENDING
    const timeFormatted = convertUnixTimeToFromNowFormat(tx.timestamp)
    const { address: tokenAddress, data: balance } =
      tx.txType === TxType.CONTRACT_CALL
        ? tx.receipt?.logs.filter(log =>
            log.topics.find(topic =>
              topic
                .toLowerCase()
                .includes(wallet.smartWalletAddress.substring(2).toLowerCase()),
            ),
          )[0] || { address: '', data: '0x0' }
        : { address: rbtcAddress, data: tx.value }
    if (!tokenAddress || tokenAddress === rbtcAddress) {
      return {
        symbol: tokenAddress
          ? rbtcSymbol
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
    const { data: fee } = tx.receipt?.logs
      .filter(log => log.address.toLowerCase() === tokenAddress)
      .filter(log =>
        log.topics.every(
          topic =>
            !topic
              .toLowerCase()
              .includes(wallet.smartWalletAddress.substring(2).toLowerCase()),
        ),
      )[0] || { data: '' }
    const feeRbtc = BigNumber.from(tx.gasPrice).mul(BigNumber.from(tx.gas))
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
        prices[tokenAddress] ? prices[tokenAddress].price : 0,
      ),
      fee: fee
        ? balanceToDisplay(fee, token.decimals)
        : `${balanceToDisplay(feeRbtc, token.decimals)} ${rbtcSymbol}`,
      total: fee
        ? balanceToDisplay(
            BigNumber.from(fee).add(BigNumber.from(balance)),
            token.decimals,
          )
        : balanceToDisplay(balance, token.decimals),
    }
  }
}

export default useActivityDeserializer
