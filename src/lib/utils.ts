import { TransactionResponse } from '@ethersproject/abstract-provider'
import { BigNumber, BigNumberish, FixedNumber } from 'ethers'
import moment from 'moment'

import { abiEnhancer } from 'core/setup'
import { ApiTransactionWithExtras } from 'src/redux/slices/transactionsSlice'

import { ChainID } from './eoaWallet'

export function shortAddress(address: string, amount = 4): string {
  if (!address) {
    return ''
  }

  return `${address.substr(0, amount + 2)}...${address.substr(
    address.length - amount,
    address.length,
  )}`
}

export const roundBalance = (num: number, decimalPlaces?: number) => {
  const decimals = Math.pow(10, decimalPlaces || 5)
  return Math.round(num * decimals) / decimals
}

export const displayRoundBalance = (num: number, symbol?: string): string => {
  if (symbol?.startsWith('BTC')) {
    return num.toFixed(8)
  }
  const rounded = roundBalance(num, 4) || roundBalance(num, 8)
  return rounded.toString()
}

export const formatTimestamp = (timestamp: number) => {
  const a = new Date(timestamp * 1000)
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]
  const year = a.getFullYear()
  const month = months[a.getMonth()]
  const date = a.getDate()
  const hour = a.getHours()
  const min = a.getMinutes()
  const sec = a.getSeconds()
  const time =
    date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec
  return time
}

export const convertTokenToUSD = (
  balance: number,
  quote: number,
  round?: boolean,
) => (round ? Math.round(balance * quote * 10000) / 10000 : balance * quote)

export const convertUSDtoToken = (
  balance: number,
  quote: number,
  round?: boolean,
) => (round ? Math.round((balance / quote) * 10000) / 10000 : balance / quote)

/**
 * Used to display token balances. Should only be used to display to the user
 * and not in calculations as it is NOT PERCISE!
 * @param tokenBalance hex/string
 * @param tokenDecimals number
 * @param resultDecimals number, optional
 * @returns string display for the user
 */
export const balanceToDisplay = (
  tokenBalance: BigNumberish,
  tokenDecimals: number,
  resultDecimals?: number,
): string => {
  // this is our 10xxxx... value
  const pot = BigNumber.from(10).pow(BigNumber.from(tokenDecimals))

  // this handles both strings and hex values:
  const fixedNumber = FixedNumber.from(BigNumber.from(tokenBalance))

  // divide unsafe because it is not percise!
  const fixed = fixedNumber.divUnsafe(FixedNumber.from(pot))

  const parts = fixed.toString().split('.')

  // removes decimals numbers if they are not wanted
  const trimResultDecimals = resultDecimals
    ? parts[1].substring(0, resultDecimals)
    : parts[1]
  const decimalPart = parts[1] === '0' ? '' : `.${trimResultDecimals}`

  return `${parts[0]}${decimalPart}`
}

/**
 * Gets an ESTIMATE of the total USD balance given a token's balance, decimals and the quote.
 * Uses UNSAFE math and SHOULD NOT be used in percise calculations
 * @param tokenBalance BigNumberish
 * @param tokenDecimals number
 * @param quote number
 * @returns formatted string prefixed with $ and two decimal points
 */
export const balanceToUSD = (
  tokenBalance: BigNumberish,
  tokenDecimals: number,
  quote: number,
): string => {
  const pot = BigNumber.from(10).pow(BigNumber.from(tokenDecimals))
  const fixedNumber = FixedNumber.from(BigNumber.from(tokenBalance))
  const fixed = fixedNumber.divUnsafe(FixedNumber.from(pot))

  // switch to numbers:
  const numberAmount = parseFloat(fixed.toString()) * quote

  return numberAmount < 0.01
    ? '< $0.01'
    : `$${Math.round(numberAmount * 100) / 100}`
}

export const convertBalance = (
  tokenBalance: BigNumberish,
  tokenDecimals: number,
  quote: number,
): number => {
  const pot = BigNumber.from(10).pow(BigNumber.from(tokenDecimals))
  const fixedNumber = FixedNumber.from(BigNumber.from(tokenBalance))
  const fixed = fixedNumber.divUnsafe(FixedNumber.from(pot))

  // switch to numbers:
  return Math.round(parseFloat(fixed.toString()) * quote * 100) / 100
}

export const trimValue = (value: string) => {
  if (value.length > 6) {
    return `${value.substr(0, 6)}...`
  }
  return value
}

// should be used for input components
export const sanitizeDecimalText = (text: string) => {
  // convert commas to dots
  let newText = text.replace(/[^0-9,.]/g, '').replace(',', '.')
  const dotsCount = newText.split('.').length - 1
  if (dotsCount > 1 || (dotsCount === 1 && newText.length === 1)) {
    // remove the last character if it is a duplicated dot
    // or if the dot is the first character
    newText = newText.slice(0, -1)
  }

  if (newText.length > 1 && newText[0] === '0' && newText[1] !== '.') {
    newText = removeLeadingZeros(newText)
  }

  return newText
}

export const sanitizeMaxDecimalText = (text: string, maxDecimal = 6) => {
  const textSplitted = text.split('.')
  if (textSplitted[1] && textSplitted[1].length > maxDecimal) {
    return `${textSplitted[0]}.${textSplitted[1].slice(0, maxDecimal)}`
  }
  return text
}

export const convertUnixTimeToFromNowFormat = (unixTime: number): string =>
  moment.unix(Number(unixTime)).fromNow()

export const removeLeadingZeros = (value: string) => {
  return value.replace(/^0+/, '')
}

/**
 * Creates a pending tx object from a transaction response
 * @param txResponse transaction response
 * @param params additional required params to create a pending transaction
 * @returns pending transaction object
 */
export const createPendingTxFromTxResponse = async (
  txResponse: TransactionResponse,
  { chainId, from, to }: { chainId: ChainID; from: string; to: string },
) => {
  try {
    const enhancedTx = await abiEnhancer.enhance(chainId, {
      data: txResponse.data,
    })
    return {
      transactionIndex: 0,
      gas: 0,
      gasPrice: '',
      input: '',
      txId: '',
      txType: 'contract call',
      ...txResponse,
      value: txResponse.value.toString(),
      chainId,
      from,
      to,
      finalAddress: to,
      symbol: enhancedTx?.symbol,
      enhancedAmount: enhancedTx?.value?.toString(),
      timestamp: moment().unix(),
    } as ApiTransactionWithExtras
  } catch (_) {
    console.warn('Error adding pending transaction')
    return null
  }
}
