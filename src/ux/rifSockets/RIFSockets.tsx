import React, { useState } from 'react'
import { useSelectedWallet } from '../../Context'
import { io, Socket } from 'socket.io-client'
import {
  abiEnhancer,
  rifWalletServicesFetcher,
} from '../../core/setup'
import { rifWalletServicesUrl } from '../../core/config'

import {
  Action,
  Dispatch,
  IActivityTransaction,
  State,
  SubscriptionsProviderProps,
} from './types'
import {
  IApiTransaction,
  ITokenWithBalance,
} from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import { enhanceTransactionInput } from '../../screens/activity/ActivityScreen'

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

export function RIFSocketsProvider({ children }: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    liveSubscriptionsReducer,
    initialState,
  )
  const [connectedSocket, setConnectedSocket] = useState<Socket>()

  const { wallet, isDeployed } = useSelectedWallet()

  React.useEffect(() => {
    if (isDeployed) {
      const connect = async () => {
        const fetchedTransactions =
          await rifWalletServicesFetcher.fetchTransactionsByAddress(
            wallet.smartWalletAddress,
          )

        const activityTransactions = await Promise.all<IActivityTransaction[]>(
          fetchedTransactions.data.map(async (tx: IApiTransaction) => {
            const enhancedTransaction = await enhanceTransactionInput(
              tx,
              wallet,
              abiEnhancer,
            )
            return {
              originTransaction: tx,
              enhancedTransaction,
            }
          }),
        )

        const fetchedTokens =
          (await rifWalletServicesFetcher.fetchTokensByAddress(
            wallet.smartWalletAddress,
          )) as ITokenWithBalance[]

        dispatch({
          type: 'init',
          payload: {
            transactions: activityTransactions,
            balances: fetchedTokens,
          },
        })

        const socket = io(rifWalletServicesUrl, {
          path: '/ws',
          forceNew: true,
          reconnectionAttempts: 3,
          timeout: 2000,
          autoConnect: true,
          transports: ['websocket'], // you need to explicitly tell it to use websocket
        })

        socket.on('connect', () => {
          socket.on('change', (event: Action) => {
            dispatch(event)
          })

          socket.emit('subscribe', { address: wallet.smartWalletAddress })
        })

        setConnectedSocket(socket)
      }

      connect()

      return function cleanup() {
        connectedSocket?.disconnect()
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
