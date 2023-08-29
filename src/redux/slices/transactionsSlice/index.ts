import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { BitcoinTransactionType } from '@rsksmart/rif-wallet-bitcoin'
import { IActivityTransaction, IEvent } from '@rsksmart/rif-wallet-services'
import { BigNumber, constants, utils } from 'ethers'

import {
  balanceToDisplay,
  convertBalance,
  convertTokenToUSD,
  convertUnixTimeToFromNowFormat,
} from 'lib/utils'

import {
  ActivityMixedType,
  ActivityRowPresentationObject,
  ApiTransactionWithExtras,
  IBitcoinTransaction,
  ModifyTransaction,
  TransactionsState,
} from 'store/slices/transactionsSlice/types'
import { TransactionStatus } from 'screens/transactionSummary/types'
import { filterEnhancedTransactions } from 'src/subscriptions/utils'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { UsdPricesState } from 'store/slices/usdPricesSlice'
import { getTokenAddress } from 'core/config'
import { AsyncThunkWithTypes } from 'store/store'
import {
  ChainTypeEnum,
  chainTypesById,
  ChainTypesByIdType,
} from 'shared/constants/chainConstants'
import { TokenSymbol } from 'screens/home/TokenImage'

export const activityDeserializer: (
  activityTransaction: ActivityMixedType,
  prices: UsdPricesState,
  chainId: ChainTypesByIdType,
) => ActivityRowPresentationObject = (activityTransaction, prices, chainId) => {
  if ('isBitcoin' in activityTransaction) {
    const fee = activityTransaction.fees
    const totalCalculated = BigNumber.from(
      Math.round(Number(activityTransaction.valueBtc) * Math.pow(10, 8)),
    ).add(BigNumber.from(Math.round(Number(activityTransaction.fees))))

    return {
      symbol: activityTransaction.symbol,
      to: activityTransaction.to,
      from: activityTransaction.from,
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
      fee: {
        tokenValue: `${fee} satoshi`,
        usdValue: convertBalance(
          BigNumber.from(fee),
          8,
          prices.BTC?.price,
        ).toFixed(2),
      },
      total: {
        tokenValue: balanceToDisplay(totalCalculated, 8),
        usdValue:
          Number(balanceToDisplay(totalCalculated, 8)) * prices.BTC?.price,
      },
      amIReceiver: activityTransaction.amIReceiver,
      timestamp: activityTransaction.blockTime,
    } as ActivityRowPresentationObject
  } else {
    const tx = activityTransaction.originTransaction
    const etx = activityTransaction.enhancedTransaction

    // RBTC
    const rbtcSymbol =
      chainTypesById[chainId] === ChainTypeEnum.MAINNET
        ? TokenSymbol.RBTC
        : TokenSymbol.TRBTC
    const rbtcAddress = constants.AddressZero
    const feeRbtc = BigNumber.from(tx.gasPrice).mul(
      BigNumber.from(tx.receipt?.gasUsed || 1),
    )

    // Token
    const tokenValue = etx?.value || balanceToDisplay(tx.value, 18)
    const tokenSymbol = etx?.symbol || rbtcSymbol
    let tokenContract = ''
    try {
      tokenContract =
        etx?.symbol === rbtcSymbol
          ? rbtcAddress
          : getTokenAddress(tokenSymbol, chainTypesById[chainId])
    } catch {}
    const tokenQuote = prices[tokenContract.toLowerCase()]?.price || 0
    const tokenUsd = convertTokenToUSD(Number(tokenValue), tokenQuote)

    // Fee
    const feeValue = etx?.feeValue || balanceToDisplay(feeRbtc, 18)
    const feeSymbol = etx?.feeSymbol || rbtcSymbol
    let feeContract = ''
    try {
      feeContract =
        etx?.feeSymbol === rbtcSymbol
          ? rbtcAddress
          : getTokenAddress(feeSymbol, chainTypesById[chainId])
    } catch {}
    const feeQuote = prices[feeContract.toLowerCase()]?.price || 0
    const feeUsd = convertTokenToUSD(Number(feeValue), feeQuote).toFixed(2)

    return {
      id: tx.hash,
      to: etx?.to || tx.to,
      from: etx?.from,
      status: tx.receipt
        ? TransactionStatus.SUCCESS
        : TransactionStatus.PENDING,
      value: tokenValue,
      symbol: tokenSymbol,
      price: tokenUsd,
      fee: {
        tokenValue: feeValue,
        symbol: feeSymbol,
        usdValue: feeUsd,
      },
      timeHumanFormatted: convertUnixTimeToFromNowFormat(tx.timestamp),
      timestamp: tx.timestamp,
    } as ActivityRowPresentationObject
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
  ]
}

export const deserializeTransactions = (transactions: IActivityTransaction[]) =>
  transactions.filter(filterEnhancedTransactions)

const transformTransaction = (
  transaction: BitcoinTransactionType,
): IBitcoinTransaction => {
  // TODO: bip.network was undefined, it does not exist in the type
  // temporarily set it to empty string
  return {
    ...transaction,
    isBitcoin: true,
    symbol: '',
    status:
      transaction.confirmations > 0
        ? TransactionStatus.SUCCESS
        : TransactionStatus.PENDING,
    to: transaction.vout[0].addresses[0],
    valueBtc: utils.formatUnits(BigNumber.from(transaction.value), 8),
    id: transaction.txid,
    sortTime: transaction.blockTime,
    amIReceiver: !transaction.vin.some(
      tx => 'isOwn' in tx && tx.isOwn === true,
    ),
    from:
      transaction.vout.find(vout => !vout.isOwn)?.addresses[0] ||
      transaction.vout[0].addresses[0] ||
      '', // First match that is not ours - else first match if exists - else nothing
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
      activityDeserializer(tx, usdPrices, settings.chainId),
    )

    thunkAPI.dispatch(addBitcoinTransactions(deserializedTransactions))
  }
})

export const addPendingTransaction = createAsyncThunk<
  void,
  ApiTransactionWithExtras,
  AsyncThunkWithTypes
>('transactions/addPendingTransaction', async (payload, thunkAPI) => {
  const { usdPrices, settings } = thunkAPI.getState()

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

  const deserializedTransaction = activityDeserializer(
    pendingTransaction,
    usdPrices,
    settings.chainId,
  )

  thunkAPI.dispatch(addPendingTransactionState(deserializedTransaction))
})

export const modifyTransaction = createAsyncThunk<
  void,
  ModifyTransaction,
  AsyncThunkWithTypes
>('transactions/modifyTransaction', async (payload, thunkAPI) => {
  try {
    const {
      transactions: { transactions },
    } = thunkAPI.getState()

    const transaction = transactions.find(tx => tx.id === payload.hash)
    if (transaction) {
      const modifiedTransaction: ActivityRowPresentationObject = {
        ...transaction,
        status: TransactionStatus.SUCCESS,
      }

      thunkAPI.dispatch(modifyTransactionState(modifiedTransaction))
    }
  } catch (err) {
    thunkAPI.rejectWithValue(err)
  }
})

interface ObjectWithTimestamp {
  timestamp: number
}

const sortObjectsByTimestamp = <T extends ObjectWithTimestamp>(a: T, b: T) =>
  b.timestamp - a.timestamp

const transactionsSlice = createSlice({
  name: 'transactions',
  initialState,
  reducers: {
    addNewTransactions: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject[]>,
    ) => {
      state.transactions = payload.sort(sortObjectsByTimestamp)
      return state
    },
    addBitcoinTransactions: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject[]>,
    ) => {
      payload.forEach(btcTx => {
        const transactionExistsIndex = state.transactions.findIndex(
          tx => tx.id === btcTx.id,
        )
        if (transactionExistsIndex === -1) {
          // Doesn't exists
          state.transactions.push(btcTx)
        } else {
          // Update tx that exists
          state.transactions[transactionExistsIndex] = btcTx
        }
      })
      state.transactions = state.transactions.sort(sortObjectsByTimestamp)
      return state
    },
    addNewTransaction: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject>,
    ) => {
      const transactionIndex = state.transactions.findIndex(
        tx => tx.id === payload.id,
      )
      if (transactionIndex === -1) {
        state.transactions.push(payload)
      }
      state.transactions = state.transactions.sort(sortObjectsByTimestamp)
    },
    addNewEvent: (state, { payload }: PayloadAction<IEvent>) => {
      state.events.push(payload)
      return state
    },
    addPendingTransactionState: (
      state,
      { payload }: PayloadAction<ActivityRowPresentationObject>,
    ) => {
      state.transactions.splice(0, 0, payload)
      return state
    },
    modifyTransactionState: (
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
    })
    builder.addCase(fetchBitcoinTransactions.rejected, state => {
      state.loading = false
    })
    builder.addCase(fetchBitcoinTransactions.fulfilled, state => {
      state.loading = false
    })
  },
})

export const {
  addNewTransactions,
  addBitcoinTransactions,
  addNewTransaction,
  addNewEvent,
  modifyTransactionState,
  addPendingTransactionState,
} = transactionsSlice.actions
export const transactionsReducer = transactionsSlice.reducer

export * from './selectors'
export * from './types'
