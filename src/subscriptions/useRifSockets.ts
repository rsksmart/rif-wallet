import {
  Action,
  IActivityTransaction,
  State,
  SubscriptionsProviderProps,
} from './types'
import { useContext, useEffect, useReducer } from 'react'
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { AppContext, useSelectedWallet } from '../Context'
import { useConnectSocket } from './useConnectSocket'
import { useOnSocketChangeEmitted } from './useOnSocketChangeEmitted'
import { useOnSocketInit } from './useOnSocketInit'

function liveSubscriptionsReducer(state: State, action: Action) {
  const { type } = action
  switch (action.type) {
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
        isSetup: true,
        balances: balancesInitial,
        transactions: {
          ...state.transactions,
          activityTransactions: action.payload.transactions,
        },
      }

    case 'reset':
      return initialState

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
  balances: {},
  events: [],
  isSetup: false,
}

export const useRifSockets = ({
  rifServiceSocket,
  abiEnhancer,
  appActive,
}: Omit<SubscriptionsProviderProps, 'children'>) => {
  const [state, dispatch] = useReducer(liveSubscriptionsReducer, initialState)
  const setGlobalError = useSetGlobalError()
  const { mnemonic } = useContext(AppContext)
  const { wallet } = useSelectedWallet()

  const onSocketsChange = useOnSocketChangeEmitted({
    dispatch,
    abiEnhancer,
    wallet,
  })
  const onSocketInit = useOnSocketInit({ dispatch })
  const onSocketError = () => setGlobalError('Error connecting to the socket')
  const connect = useConnectSocket({
    rifServiceSocket,
    onError: onSocketError,
    onChange: onSocketsChange,
    onInit: onSocketInit,
    mnemonic,
    wallet,
  })

  useEffect(() => {
    if (wallet && rifServiceSocket) {
      // socket is connected to a different wallet
      if (rifServiceSocket.isConnected()) {
        rifServiceSocket.disconnect()
        dispatch({ type: 'reset' })
      }
      connect()

      return function cleanup() {
        rifServiceSocket?.disconnect()
      }
    }
  }, [wallet])

  // Disconnect from the rifServiceSocket when the app goes to the background
  const onWalletAppActiveChange = () => {
    if (!appActive) {
      return rifServiceSocket?.disconnect()
    }

    if (wallet && rifServiceSocket && !rifServiceSocket.isConnected()) {
      connect()
    }
  }
  useEffect(() => {
    onWalletAppActiveChange()
  }, [appActive])

  return { state, dispatch }
}
