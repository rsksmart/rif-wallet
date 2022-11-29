import { InitAction, SubscriptionsProviderProps } from './types'
import { useContext, useEffect } from 'react'
import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { AppContext, useSelectedWallet } from '../Context'
import { useConnectSocket } from './useConnectSocket'
import { useOnSocketChangeEmitted } from './useOnSocketChangeEmitted'
import { useAppDispatch } from 'store/storeHooks'
import { resetSocketState } from 'store/shared/actions/resetSocketState'

export const useRifSockets = ({
  rifServiceSocket,
  abiEnhancer,
  appActive,
}: Omit<SubscriptionsProviderProps, 'children'>) => {
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
        dispatchRedux(resetSocketState())
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

  return null
}
