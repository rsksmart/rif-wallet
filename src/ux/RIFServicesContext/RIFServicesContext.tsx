import React from 'react'

export interface ITransaction {
  _id: string,
  hash: string,
  nonce: number,
  blockHash: string,
  blockNumber: number,
  transactionIndex: string,
  from: string,
  to: string,
  gas: number,
  gasPrice: string, // Should we do it a BigNumber?
  value: string, // Same here
  input: string,
  v: string,
  r: string,
  s: string,
  timestamp: number,
  receipt: {
    transactionHash: string,
    transactionIndex: number,
    blockHash: string,
    blockNumber: number,
    cumulativeGasUsed: string,
    gasUsed: number,
    contractAddress: any,
    logs: Array<any>,
    from: string,
    to: string,
    status: string,
    logsBloom: string,
  },
  txType: string,
  txId: string,
}

export interface IToken {
  name: string,
  symbol: string,
  contractAddress: string,
  decimals: number,
  balance: string,
}

export interface NewBlanceAction {
  type: 'newBalance',
  payload: IToken,
}

export interface NewPriceAction {
  type: 'newPrice',
  payload: Record<string, { price: number, lastUpdated: string }>
}

export interface NewTransactionAction {
  type: 'newTransaction',
  payload: ITransaction
}

export interface State {
  balances: Array<IToken>
  prices: Record<string, { price: number, lastUpdated: string }>
  transactions: Array<ITransaction>
}

type Action = NewBlanceAction | NewPriceAction | NewTransactionAction
type Dispatch = (action: Action) => void
type SubscriptionsProviderProps = { children: React.ReactNode }

function liveSubscribtionReducer(state: State, action: Action) {
  const { type } = action;

  switch (action.type) {
    case 'newBalance':
      return {
        ...state,
        balances: [action.payload, ...state.balances]
      }

    case 'newPrice':
      return {
        ...state,
        prices: {
          ...state.prices,
          ...action.payload
        }
      }

    case 'newTransaction':
      return {
        ...state,
        transactions: [action.payload, ...state.transactions]
      }

    default:
      throw new Error(`Unhandled action type: ${type}`)
  }

}

const initialState = {
  prices: {},
  balances: [],
  transactions: []
}

const RIFServicesContext = React.createContext<{ state: State, dispatch: Dispatch } | undefined>(undefined)

export function SubscriptionsProvider({ children }: SubscriptionsProviderProps) {
  const [state, dispatch] = React.useReducer(liveSubscribtionReducer, initialState)
  const value = { state, dispatch }
  return (
    <RIFServicesContext.Provider value={value}>
      {children}
    </RIFServicesContext.Provider>
  )
}

export function useSubscription() {
  const context = React.useContext(RIFServicesContext)
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionsProvider')
  }
  return context
}