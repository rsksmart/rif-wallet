import React from 'react'
import { useSelectedWallet } from '../../Context'
import { io } from 'socket.io-client'
import { rifWalletServicesUrl } from '../../core/setup'

import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

export interface ITransaction {
  _id: string
  hash: string
  nonce: number
  blockHash: string
  blockNumber: number
  transactionIndex: string
  from: string
  to: string
  gas: number
  gasPrice: string // Should we do it a BigNumber?
  value: string // Same here
  input: string
  v: string
  r: string
  s: string
  timestamp: number
  receipt: {
    transactionHash: string
    transactionIndex: number
    blockHash: string
    blockNumber: number
    cumulativeGasUsed: string
    gasUsed: number
    contractAddress: any
    logs: Array<any>
    from: string
    to: string
    status: string
    logsBloom: string
  }
  txType: string
  txId: string
}

export interface IPrice {
  price: number
  lastUpdated: string
}

export interface NewBlanceAction {
  type: 'newBalance'
  payload: ITokenWithBalance
}

export interface NewPriceAction {
  type: 'newPrice'
  payload: Record<string, { price: number; lastUpdated: string }>
}

export interface NewTransactionAction {
  type: 'newTransaction'
  payload: ITransaction
}

export interface State {
  balances: Record<string, ITokenWithBalance>
  prices: Record<string, IPrice>
  transactions: Array<ITransaction>
}

type Action = NewBlanceAction | NewPriceAction | NewTransactionAction
type Dispatch = (action: Action) => void
type SubscriptionsProviderProps = { children: React.ReactNode }

function liveSubscribtionReducer(state: State, action: Action) {
  const { type } = action

  switch (action.type) {
    case 'newBalance':
      return {
        ...state,
        balances: {
          ...state.balances,
          [action.payload.contractAddress]: {...action.payload, logo: ''} // Need to define where are this logos coming from
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
  prices: {},
  balances: {},
  transactions: [],
}

const RIFSocketsContext = React.createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined)

export function RIFSocketsProvider({ children }: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(
    liveSubscribtionReducer,
    initialState,
  )

  const { wallet, isDeployed } = useSelectedWallet()

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
