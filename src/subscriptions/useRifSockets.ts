import { useCallback, useEffect } from 'react'

import { IAbiEnhancer } from 'lib/abiEnhancer/AbiEnhancer'
import { IRifWalletServicesSocket } from 'lib/rifWalletServices/RifWalletServicesSocket'

import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { useConnectSocket } from './useConnectSocket'
import { useOnSocketChangeEmitted } from './useOnSocketChangeEmitted'
import { useAppSelector, useAppDispatch } from 'store/storeUtils'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { selectActiveWallet, selectKMS } from 'store/slices/settingsSlice'
import { InitAction } from './types'

interface IUseRifSockets {
  rifServiceSocket?: IRifWalletServicesSocket
  abiEnhancer: IAbiEnhancer
  appActive: boolean
  mnemonic?: string
}
export const useRifSockets = ({
  rifServiceSocket,
  abiEnhancer,
  appActive,
}: IUseRifSockets) => {
  const dispatch = useAppDispatch()
  const setGlobalError = useSetGlobalError()
  const kms = useAppSelector(selectKMS)
  const { wallet } = useAppSelector(selectActiveWallet)

  const onSocketsChange = useOnSocketChangeEmitted({
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
    mnemonic: kms?.mnemonic,
    wallet,
  })

  useEffect(() => {
    if (wallet && rifServiceSocket) {
      // socket is connected to a different wallet
      if (rifServiceSocket.isConnected()) {
        rifServiceSocket.disconnect()
        dispatch(resetSocketState())
      }
      connect()

      return function cleanup() {
        rifServiceSocket?.disconnect()
      }
    }

    return () => rifServiceSocket?.disconnect()
  }, [wallet, connect, dispatch, rifServiceSocket])

  // Disconnect from the rifServiceSocket when the app goes to the background
  const onWalletAppActiveChange = useCallback(() => {
    if (!appActive) {
      return rifServiceSocket?.disconnect()
    }

    if (wallet && rifServiceSocket && !rifServiceSocket.isConnected()) {
      connect()
    }
  }, [appActive, connect, rifServiceSocket, wallet])

  useEffect(() => {
    onWalletAppActiveChange()
  }, [onWalletAppActiveChange])

  return null
}
