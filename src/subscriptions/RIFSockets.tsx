import React from 'react'
import { useSelectedWallet } from '../Context'
import { enhanceTransactionInput } from '../screens/activity/ActivityScreen'
import { constants } from 'ethers'

import { Action, Dispatch, State, SubscriptionsProviderProps } from './types'
import { ITokenWithBalance } from '../lib/rifWalletServices/RIFWalletServicesTypes'
import { RIFWallet } from '../lib/core'

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
  dispatch({ type: 'newBalance', payload: newEntry })
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
  setInterval(async () => {
    loadRBTCBalance(wallet, dispatch).then()
  }, 5000)

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
