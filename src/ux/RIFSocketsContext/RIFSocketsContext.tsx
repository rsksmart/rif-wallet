import React from 'react'
import { useSelectedWallet } from '../../Context'
import { constants } from 'ethers'
import { io } from 'socket.io-client'
import { rifWalletServicesUrl } from '../../core/setup'

import {
  Action,
  Dispatch,
  LoadRBTCBalance,
  State,
  SubscriptionsProviderProps,
} from './types'

function liveSubscribtionReducer(state: State, action: Action) {
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
  | { state: State; dispatch: Dispatch; loadRBTCBalance: LoadRBTCBalance }
  | undefined
>(undefined)

export function RIFSocketsProvider({ children }: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    liveSubscribtionReducer,
    initialState,
  )

  const { wallet, isDeployed } = useSelectedWallet()

  const loadRBTCBalance = async () => {
    const rbtcBalanceEntry = await wallet
      .provider!.getBalance(wallet.smartWallet.address)
      .then(rbtcBalance => ({
        name: 'TRBTC',
        logo: 'TRBTC',
        symbol: 'TRBTC (eoa wallet)',
        contractAddress: constants.AddressZero,
        decimals: 18,
        balance: rbtcBalance.toString(),
      }))
    dispatch({ type: 'newBalance', payload: { ...rbtcBalanceEntry } })
  }

  React.useEffect(() => {
    const socket = io(rifWalletServicesUrl, {
      path: '/ws',
      forceNew: true,
      reconnectionAttempts: 3,
      timeout: 2000,
      autoConnect: true,
      transports: ['websocket'], // you need to explicitly tell it to use websocket
    })

    if (isDeployed) {
      socket
        .connect()
        .emit('subscribe', { address: wallet.smartWallet.address })
      socket.on('change', (event: Action) => {
        dispatch(event)
      })

      return function cleanup() {
        socket.disconnect()
      }
    }
  }, [isDeployed])

  React.useEffect(() => {
    loadRBTCBalance()
  }, [])

  const value = { state, dispatch, loadRBTCBalance }
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
