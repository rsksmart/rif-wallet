import { Action, InitAction, State, SubscriptionsProviderProps } from './types'
import { useContext, useEffect, useReducer } from 'react'
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { AppContext, useSelectedWallet } from '../Context'
import { useConnectSocket } from './useConnectSocket'
import { useOnSocketChangeEmitted } from './useOnSocketChangeEmitted'
import { useAppDispatch } from 'store/storeHooks'

function liveSubscriptionsReducer(state: State, action: Action) {
  const { type } = action
  switch (action.type) {
    case 'newTokenTransfer':
      return {
        ...state,
        events: state.events.concat([action.payload]),
      }

    default:
      throw new Error(`Unhandled action type: ${type}`)
  }
}

const initialState = {
  events: [],
  isSetup: true,
}

export const useRifSockets = ({
  rifServiceSocket,
  abiEnhancer,
  appActive,
}: Omit<SubscriptionsProviderProps, 'children'>) => {
  const [state, dispatch] = useReducer(liveSubscriptionsReducer, initialState)
  const dispatchRedux = useAppDispatch()

  const setGlobalError = useSetGlobalError()
  const { mnemonic } = useContext(AppContext)
  const { wallet } = useSelectedWallet()

  const onSocketsChange = useOnSocketChangeEmitted({
    dispatch: dispatchRedux,
    abiEnhancer,
    wallet,
  })

  const onSocketInit = (payload: InitAction['payload']) => {
    return onSocketsChange({ type: 'init', payload })
  }
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
        dispatch({ type: 'reset', payload: undefined })
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
