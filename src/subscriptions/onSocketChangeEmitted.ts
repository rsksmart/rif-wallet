import { EnhancedResult } from 'lib/abiEnhancer/AbiEnhancer'
import { IApiTransaction } from 'lib/rifWalletServices/RIFWalletServicesTypes'

import { resetSocketState } from 'store/shared/actions/resetSocketState'
import {
  addOrUpdateBalances,
  addOrUpdateNewBalance,
} from 'store/slices/balancesSlice'
import {
  addNewEvent,
  addNewTransaction,
  addNewTransactions,
} from 'store/slices/transactionsSlice/transactionsSlice'
import { setUsdPrices } from 'store/slices/usdPricesSlice'
import { AppDispatch } from 'store/index'
import { AbiWallet, Action } from './types'

interface OnNewTransactionEventEmittedArgs extends AbiWallet {
  dispatch: AppDispatch
  payload: IApiTransaction
}

interface OnSocketChangeEmittedArgs extends AbiWallet {
  dispatch: AppDispatch
}

const onNewTransactionEventEmitted = async ({
  abiEnhancer,
  wallet,
  dispatch,
  payload,
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
  } catch (err) {
  } finally {
    dispatch(addNewTransaction(payloadToUse))
  }
}

export const onSocketChangeEmitted =
  ({ dispatch, abiEnhancer, wallet }: OnSocketChangeEmittedArgs) =>
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
            payload: payload.originTransaction,
          })
          break
        case 'newTransactions':
          dispatch(addNewTransactions(payload))
          break
        case 'newBalance':
          dispatch(addOrUpdateNewBalance(payload))
          break
        case 'init':
          console.log('DISPATCH INIT TO SOCKET')
          dispatch(
            addNewTransactions({
              next: null,
              prev: null,
              activityTransactions: payload.transactions,
            }),
          )
          dispatch(addOrUpdateBalances(payload.balances))
          break
        case 'newTokenTransfer':
          // This is not being used anywhere
          dispatch(addNewEvent(payload))
          break
        default:
          throw new Error(`${type} not implemented`)
      }
    }
  }
