import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { EnhancedResult, IAbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'

import { ChainID } from 'lib/eoaWallet'

import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { addOrUpdateBalances } from 'store/slices/balancesSlice'
import {
  activityDeserializer,
  addNewTransaction,
  addNewTransactions,
  combineTransactions,
  deserializeTransactions,
  fetchBitcoinTransactions,
} from 'store/slices/transactionsSlice'
import { UsdPricesState, setUsdPrices } from 'store/slices/usdPricesSlice'
import { AppDispatch } from 'store/index'
import { getCurrentChainId } from 'storage/ChainStorage'
import { enhanceTransactionInput } from 'src/screens/activity/ActivityScreen'
import { MMKVStorage } from 'storage/MMKVStorage'

import { Action } from './types'

interface OnNewTransactionEventEmittedArgs {
  dispatch: AppDispatch
  payload: IApiTransaction
  usdPrices: UsdPricesState
  chainId: ChainID
  abiEnhancer: IAbiEnhancer
}

interface OnSocketChangeEmittedArgs {
  dispatch: AppDispatch
  usdPrices: UsdPricesState
  chainId: ChainID
  abiEnhancer: IAbiEnhancer
  cache: MMKVStorage
}

const onNewTransactionEventEmitted = async ({
  abiEnhancer,
  dispatch,
  payload,
  usdPrices,
  chainId,
}: OnNewTransactionEventEmittedArgs) => {
  const payloadToUse: {
    originTransaction: IApiTransaction
    enhancedTransaction?: EnhancedResult
  } = {
    originTransaction: payload,
    enhancedTransaction: undefined,
  }
  try {
    const enhancedTransaction = await abiEnhancer.enhance(chainId, {
      from: payload.from.toLowerCase(),
      to: payload.to.toLowerCase(),
      data: payload.input,
      value: payload.value,
    })
    if (enhancedTransaction) {
      payloadToUse.enhancedTransaction = enhancedTransaction
    }
  } catch {
  } finally {
    const deserializedTransaction = activityDeserializer(
      payloadToUse,
      usdPrices,
      chainId,
    )
    dispatch(addNewTransaction(deserializedTransaction))
  }
}

export const onSocketChangeEmitted =
  ({
    dispatch,
    abiEnhancer,
    usdPrices,
    chainId,
    cache,
  }: OnSocketChangeEmittedArgs) =>
  async (action: Action) => {
    // Temporal patch to avoid dispatching events if current chainId does not match
    // @TODO find root cause of why the rifSockets is emitting an outdated event
    // Suspect is the .disconnect is not playing its part
    if (chainId !== getCurrentChainId()) {
      return
    }
    if (action.type === 'reset') {
      dispatch(resetSocketState())
    } else {
      const { type, payload } = action
      switch (type) {
        case 'newPrice':
          dispatch(setUsdPrices(payload))
          break
        case 'newTransaction':
          onNewTransactionEventEmitted({
            abiEnhancer,
            dispatch,
            payload,
            usdPrices,
            chainId,
          })
          break
        case 'newBalance':
          dispatch(addOrUpdateBalances([payload]))
          break
        case 'init':
          const cacheBlockNumberText = `blockNumber_${chainId}`
          const cacheTxsText = `cachedTxs_${chainId}`
          const { tokens, prices, transactions } = payload
          const cachedTxs = cache.get(cacheTxsText) || []
          const blockNumber = cache.get(cacheBlockNumberText) || '0'
          let lastBlockNumber = blockNumber
          const enhancedTransactions = await Promise.all(
            transactions.data.map(async tx => {
              if (parseInt(blockNumber, 10) < tx.blockNumber) {
                lastBlockNumber = tx.blockNumber
              }
              if (cache.has(tx.hash)) {
                return {
                  originTransaction: tx,
                  enhancedTransaction: cache.get(tx.hash),
                }
              }
              const enhancedTransaction = await enhanceTransactionInput(
                tx,
                chainId,
              )
              if (enhancedTransaction) {
                cache.set(tx.hash, enhancedTransaction)
                return {
                  originTransaction: tx,
                  enhancedTransaction: enhancedTransaction,
                }
              }
              return {
                originTransaction: tx,
                enhancedTransaction: undefined,
              }
            }),
          )
          const deserializedRifTransactions = deserializeTransactions(
            cachedTxs.concat(enhancedTransactions),
          )
          const combinedTransactions = combineTransactions(
            deserializedRifTransactions,
            [],
          )
          cache.set(cacheBlockNumberText, lastBlockNumber.toString())
          cache.set(cacheTxsText, deserializedRifTransactions)

          const deserializedTransactions = combinedTransactions.map(tx =>
            activityDeserializer(tx, prices, chainId),
          )
          dispatch(setUsdPrices(prices))
          dispatch(fetchBitcoinTransactions({}))
          dispatch(addNewTransactions(deserializedTransactions))
          dispatch(addOrUpdateBalances(tokens))
          break
        default:
          throw new Error(`${type} not implemented`)
      }
    }
  }
