import React, { useEffect } from 'react'
import { useSelectedWallet } from '../Context'
import { enhanceTransactionInput } from '../screens/activity/ActivityScreen'

import { Action, Dispatch, State, SubscriptionsProviderProps } from './types'

function liveSubscriptionsReducer(state: State, action: Action) {
  const { type } = action

  switch (action.type) {
    case 'newActivity':
      return {
        ...state,
        activities: action.payload,
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
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
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
        transactions: [...action.payload.transactions],
        balances: balancesInitial,
      }

    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

const initialState = {
  activities: {
    activityTransactions: [],
    data: [],
    next: null,
    prev: null,
  },
  prices: {},
  balances: {},
  transactions: [],
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

  // @JESSE REFACTOR THIS CODE AND THE LINES BELOW TO DISCONNECT FROM
  // AN ADDRESS AND CONNECT TO ANOTHER
  const connect = () => {
    console.log('rifServiceSocket connect()', wallet.smartWalletAddress)
    rifServiceSocket?.on('init', result => {
      console.log('rifServiceSocket init', result)
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

  React.useEffect(() => {
    if (isWalletDeployed || isDeployed) {
      connect()

      return function cleanup() {
        rifServiceSocket?.disconnect()
      }
    }
  }, [isDeployed])

  useEffect(() => {
    console.log('RIFSockets.tsx, the selected wallet has changed!', wallet)
    console.log(rifServiceSocket)
    rifServiceSocket && rifServiceSocket.disconnect()
    connect()
  }, [wallet])

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
