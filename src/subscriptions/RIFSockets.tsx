import React from 'react'
import { useSelectedWallet } from '../Context'
import { enhanceTransactionInput } from '../screens/activity/ActivityScreen'
import { filterEnhancedTransactions, sortEnhancedTransactions } from './utils'

import {
  Action,
  Dispatch,
  IActivityTransaction,
  State,
  SubscriptionsProviderProps,
} from './types'

function liveSubscriptionsReducer(state: State, action: Action) {
  const { type } = action

  switch (action.type) {
    case 'newTransactions':
      const sortedTxs: Array<IActivityTransaction> = [
        ...action.payload!.activityTransactions,
        ...state.transactions!.activityTransactions,
      ]
        .sort(sortEnhancedTransactions)
        .filter(filterEnhancedTransactions)

      return {
        ...state,
        transactions: {
          ...action.payload,
          data: [...state.transactions.data, ...action.payload!.data],
          activityTransactions: sortedTxs,
        },
      }

    case 'newBalance':
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.payload.contractAddress]: { ...action.payload, logo: '' }, // Need to define where are this logos coming from
        },
      }

    case 'newPrice':
      return {
        ...state,
        prices: {
          ...state.prices,
          ...action.payload,
        },
      }

    case 'newTransaction':
      const sortedTx: Array<IActivityTransaction> = [
        action.payload,
        ...state.transactions!.activityTransactions,
      ]
        .sort(sortEnhancedTransactions)
        .filter(filterEnhancedTransactions)

      return {
        ...state,
        transactions: {
          ...state.transactions,
          data: [action.payload.originTransaction, ...state.transactions.data],
          activityTransactions: sortedTx,
        },
      }

    case 'init':
      const balancesInitial = action.payload.balances.reduce(
        (accum, current) => {
          return {
            ...accum,
            [current.contractAddress]: { ...current, logo: '' }, // why logo is empty?
          }
        },
        {},
      )

      return {
        ...state,
        balances: balancesInitial,
        transactions: {
          ...state.transactions,
          activityTransactions: action.payload.transactions,
        },
      }

    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

const initialState = {
  transactions: {
    activityTransactions: [],
    data: [],
    next: null,
    prev: null,
  },
  prices: {},
  balances: {},
}

const RIFSocketsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

export function RIFSocketsProvider({
  children,
  rifServiceSocket,
  isWalletDeployed,
  abiEnhancer,
}: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    liveSubscriptionsReducer,
    initialState,
  )

  const { wallet, isDeployed } = useSelectedWallet()

  React.useEffect(() => {
    if (isWalletDeployed || isDeployed) {
      const connect = async () => {
        rifServiceSocket?.on('init', result => {
          dispatch({
            type: 'init',
            payload: result,
          })
        })

        rifServiceSocket?.on('change', result => {
          if (result.type === 'newTransaction') {
            enhanceTransactionInput(result.payload, wallet, abiEnhancer)
              .then(enhancedTransaction => {
                console.log(enhancedTransaction)
                dispatch({
                  type: 'newTransaction',
                  payload: {
                    originTransaction: result.payload,
                    enhancedTransaction,
                  },
                })
              })
              .catch(() => {
                dispatch({
                  type: 'newTransaction',
                  payload: {
                    originTransaction: result.payload,
                    enhancedTransaction: undefined,
                  },
                })
              })
          } else {
            dispatch(result as any)
          }
        })

        rifServiceSocket?.connect(wallet)
      }

      connect()

      return function cleanup() {
        rifServiceSocket?.disconnect()
      }
    }
  }, [isDeployed])

  const value = { state, dispatch }
  return (
    <RIFSocketsContext.Provider value={value}>
      {children}
    </RIFSocketsContext.Provider>
  )
}

export function useSocketsState() {
  const context = React.useContext(RIFSocketsContext)
  if (context === undefined) {
    throw new Error(
      'useSubscription must be used within a SubscriptionsProvider',
    )
  }
  return context
}
