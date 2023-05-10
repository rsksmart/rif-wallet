import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BitcoinTransactionType } from '@rsksmart/rif-wallet-bitcoin'
import { BigNumber, utils } from 'ethers'
import { IActivityTransaction, IEvent } from '@rsksmart/rif-wallet-services'

import {
  balanceToDisplay,
  convertBalance,
  convertUnixTimeToFromNowFormat,
} from 'lib/utils'

import {
  ApiTransactionWithExtras,
  TransactionsState,
  ActivityMixedType,
  ActivityRowPresentationObject,
  IBitcoinTransaction,
  TransactionStatus,
} from 'store/slices/transactionsSlice/types'
import {
  filterEnhancedTransactions,
  sortEnhancedTransactions,
} from 'src/subscriptions/utils'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { UsdPricesState } from 'store/slices/usdPricesSlice'
import {
  defaultChainType,
  getTokenAddress,
  isDefaultChainTypeMainnet,
} from 'core/config'
import { TokenSymbol } from 'screens/home/TokenImage'
import { AsyncThunkWithTypes } from 'src/redux/store'

export const activityDeserializer: (
  activityTransaction: ActivityMixedType,
  prices: UsdPricesState,
) => ActivityRowPresentationObject = (activityTransaction, prices) => {
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
        prices.BTC?.price,
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

const initialState: TransactionsState = {
  next: '',
  prev: '',
  transactions: [],
  events: [],
  loading: false,
}

export function combineTransactions(
  rifTransactions: IActivityTransaction[],
  btcTransactions: (IBitcoinTransaction & { sortTime: number })[],
): ActivityMixedType[] {
  return [
    ...rifTransactions.map(rifTransaction => ({
      ...rifTransaction,
      id: rifTransaction.originTransaction.hash,
      sortTime: rifTransaction.originTransaction.timestamp,
    })),
    ...btcTransactions,
  ].sort(({ sortTime: a }, { sortTime: b }) => {
    return b - a
  })
}

export const deserializeTransactions = (transactions: IActivityTransaction[]) =>
  transactions.sort(sortEnhancedTransactions).filter(filterEnhancedTransactions)

const transformTransaction = (
  transaction: BitcoinTransactionType,
): IBitcoinTransaction => {
  // TODO: bip.network was undefined, it does not exist in the type
  // temporarily set it to empty string
  return {
    ...transaction,
    isBitcoin: true,
    symbol: '',
    status: transaction.confirmations > 0 ? 'success' : 'pending',
    to: transaction.vout[0].addresses[0],
    valueBtc: utils.formatUnits(BigNumber.from(transaction.value), 8),
    id: transaction.txid,
    sortTime: transaction.blockTime,
  }
}

interface FetchBitcoinTransactionsAction {
  pageSize?: number
  pageNumber?: number
}

export const fetchBitcoinTransactions = createAsyncThunk<
  void,
  FetchBitcoinTransactionsAction,
  AsyncThunkWithTypes
>('transactions/fetchBitcoinTransactions', async ({ pageSize }, thunkAPI) => {
  const { settings, usdPrices } = thunkAPI.getState()

  if (settings.bitcoin) {
    const { transactions: bitTransactions } =
      await settings.bitcoin.networksArr[0].bips[0].fetchTransactions(
        pageSize ?? 10,
        1,
      )

    const transformedBtcTransactions = bitTransactions.map(transformTransaction)

    const deserializedTransactions = transformedBtcTransactions.map(tx =>
      activityDeserializer(tx, usdPrices),
    )

    thunkAPI.dispatch(addNewTransactions(deserializedTransactions))
  }
})

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addNewTransactions: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject[]>,
    ) => {
      state.transactions.push(...payload)
      return state
    },
    addNewTransaction: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject>,
    ) => {
      state.transactions.push(payload)
      return state
    },
    addNewEvent: (state, { payload }: PayloadAction<IEvent>) => {
      state.events.push(payload)
      return state
    },
    addPendingTransaction: (
      state,
      { payload }: PayloadAction<ApiTransactionWithExtras>,
    ) => {
      const { symbol, finalAddress, enhancedAmount, value, ...restPayload } =
        payload
      const pendingTransaction = {
        originTransaction: {
          ...restPayload,
          value: value,
        },
        enhancedTransaction: {
          symbol,
          from: restPayload.from,
          to: finalAddress,
          value: enhancedAmount,
        },
      }
      state.transactions.push(pendingTransaction)
      return state
    },
    modifyTransaction: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject>,
    ) => {
      const indexOfTransactionToModify = state.transactions.findIndex(
        transaction => transaction.id === payload.id,
      )
      if (indexOfTransactionToModify !== -1) {
        state.transactions[indexOfTransactionToModify] = {
          ...state.transactions[indexOfTransactionToModify],
          ...payload,
        }
      }
      return state
    },
  },
  extraReducers: builder => {
    builder.addCase(resetSocketState, () => initialState)
    builder.addCase(fetchBitcoinTransactions.pending, state => {
      state.loading = true
    }),
      builder.addCase(fetchBitcoinTransactions.rejected, state => {
        state.loading = false
      }),
      builder.addCase(fetchBitcoinTransactions.fulfilled, state => {
        state.loading = false
      })
  },
})

export const {
  addNewTransactions,
  addNewTransaction,
  addNewEvent,
  modifyTransaction,
  addPendingTransaction,
} = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer

export * from './selectors'
export * from './types'
