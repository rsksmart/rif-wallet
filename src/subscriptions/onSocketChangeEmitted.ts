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
  wallet,
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
    const enhancedTransaction = await abiEnhancer.enhance(wallet, {
      from: wallet.smartWalletAddress,
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
  (action: Action) => {
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
            wallet,
            dispatch,
            payload: payload,
            usdPrices,
            chainId,
          })
          break
        case 'newBalance':
          dispatch(addOrUpdateBalances([payload]))
          break
        case 'init':
          let deserializedRifTransactions = deserializeTransactions(
            payload.transactions,
          )
          let combinedTransactions = combineTransactions(
            deserializedRifTransactions,
            [],
          )

          let deserializedTransactions = combinedTransactions.map(tx =>
            activityDeserializer(tx, usdPrices, chainId),
          )
          dispatch(fetchBitcoinTransactions({}))
          dispatch(addNewTransactions(deserializedTransactions))
          dispatch(addOrUpdateBalances(payload.balances))
          break
        default:
          throw new Error(`${type} not implemented`)
      }
    }
  }
