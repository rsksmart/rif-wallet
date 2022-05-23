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
import { constants } from 'ethers'

import { ITokenWithBalance } from '../lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from '../lib/core'

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
          prev: action.payload.prev,
          next: action.payload.next,
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
          activityTransactions: sortedTx,
        },
      }

    case 'newTokenTransfer':
      return {
        ...state,
        events: state.events.concat([action.payload]),
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
    next: null,
    prev: null,
  },
  prices: {},
  balances: {},
  events: [],
}
//TODO: Move this to the backend
const loadRBTCBalance = async (wallet: RIFWallet, dispatch: Dispatch) => {
  const rbtcBalanceEntry = await wallet.provider!.getBalance(wallet.address)

  const newEntry = {
    name: 'TRBTC (EOA)',
    logo: 'TRBTC',
    symbol: 'TRBTC',
    contractAddress: constants.AddressZero,
    decimals: 18,
    balance: rbtcBalanceEntry.toString(),
  } as ITokenWithBalance

  !rbtcBalanceEntry.isZero() &&
    dispatch({ type: 'newBalance', payload: newEntry })
}

const RIFSocketsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

export function RIFSocketsProvider({
  children,
  rifServiceSocket,
  abiEnhancer,
}: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    liveSubscriptionsReducer,
    initialState,
  )

  const { wallet } = useSelectedWallet()

  const connect = () => {
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
    if (wallet && rifServiceSocket) {
      // socket is connected to a different wallet
      if (rifServiceSocket.isConnected()) {
        rifServiceSocket.disconnect()
        dispatch({ type: 'init', payload: { transactions: [], balances: [] } })
      }

      connect()

      return function cleanup() {
        rifServiceSocket?.disconnect()
      }
    }
  }, [wallet])

  React.useEffect(() => {
    const interval = wallet
      ? setInterval(async () => {
          loadRBTCBalance(wallet, dispatch).then()
        }, 5000)
      : undefined

    return () => interval && clearInterval(interval)
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
