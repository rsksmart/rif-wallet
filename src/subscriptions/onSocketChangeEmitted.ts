import { IApiTransaction } from '@rsksmart/rif-wallet-services'
import { EnhancedResult } from '@rsksmart/rif-wallet-abi-enhancer'

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
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { getCurrentChainId } from 'storage/ChainStorage'

import { AbiWallet, Action } from './types'

interface OnNewTransactionEventEmittedArgs extends AbiWallet {
  dispatch: AppDispatch
  payload: IApiTransaction
  usdPrices: UsdPricesState
  chainId: ChainTypesByIdType
}

interface OnSocketChangeEmittedArgs extends AbiWallet {
  dispatch: AppDispatch
  usdPrices: UsdPricesState
  chainId: ChainTypesByIdType
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
    wallet,
    usdPrices,
    chainId,
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
          await onNewTransactionEventEmitted({
            abiEnhancer,
            wallet,
            dispatch,
            payload,
            usdPrices,
            chainId,
          })
          break
        case 'newBalance':
          await dispatch(addOrUpdateBalances([payload]))
          break
        case 'init':
          const deserializedRifTransactions = deserializeTransactions(
            payload.transactions,
          )
          const combinedTransactions = combineTransactions(
            deserializedRifTransactions,
            [],
          )

          const deserializedTransactions = combinedTransactions.map(tx =>
            activityDeserializer(tx, usdPrices, chainId),
          )
          dispatch(addNewTransactions(deserializedTransactions))
          await dispatch(fetchBitcoinTransactions({}))
          await dispatch(addOrUpdateBalances(payload.balances))
          break
        default:
          throw new Error(`${type} not implemented`)
      }
    }
  }
