import { useCallback, useEffect } from 'react'

import { RIFWallet } from 'lib/core'

import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { connectSocket } from './connectSocket'
import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { useAppDispatch } from 'store/storeUtils'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { rifWalletServicesSocket, abiEnhancer } from 'core/setup'
import { InitAction } from './types'

interface IUseRifSockets {
  appActive: boolean
  wallet: RIFWallet | null
  mnemonic: string | null
}
export const useRifSockets = ({
  appActive,
  wallet,
  mnemonic,
}: IUseRifSockets) => {
  const dispatch = useAppDispatch()
  const setGlobalError = useSetGlobalError()

  const onSocketInit = useCallback(
    (_wallet: RIFWallet) => {
      const onChange = onSocketChangeEmitted({
        dispatch,
        abiEnhancer,
        wallet: _wallet,
      })
      return (payload: InitAction['payload']) =>
        onChange({ type: 'init', payload })
    },
    [dispatch],
  )
  const onSocketError = useCallback(
    () => setGlobalError('Error connecting to the socket'),
    [setGlobalError],
  )

  const reconnectToSocket = useCallback(
    (_wallet: RIFWallet, _mnemonic: string) => {
      if (rifWalletServicesSocket.isConnected()) {
        rifWalletServicesSocket.disconnect()
        dispatch(resetSocketState())
      }
      connectSocket({
        rifServiceSocket: rifWalletServicesSocket,
        wallet: _wallet,
        mnemonic: _mnemonic,
        onInit: onSocketInit(_wallet),
        onError: onSocketError,
        onChange: onSocketChangeEmitted({
          dispatch,
          abiEnhancer,
          wallet: _wallet,
        }),
      })
    },
    [dispatch, onSocketError, onSocketInit],
  )

  // Disconnect from the rifServiceSocket when the app goes to the background
  const onWalletAppActiveChange = useCallback(
    (_appActive: boolean, _mnemonic: string) => {
      if (!_appActive) {
        return rifWalletServicesSocket.disconnect()
      }

      if (
        wallet &&
        rifWalletServicesSocket &&
        !rifWalletServicesSocket.isConnected()
      ) {
        connectSocket({
          rifServiceSocket: rifWalletServicesSocket,
          wallet,
          mnemonic: _mnemonic,
          onInit: onSocketInit(wallet),
          onError: onSocketError,
          onChange: onSocketChangeEmitted({ dispatch, abiEnhancer, wallet }),
        })
      }
    },
    [wallet, dispatch, onSocketInit, onSocketError],
  )

  useEffect(() => {
    if (mnemonic) {
      onWalletAppActiveChange(appActive, mnemonic)
    }
  }, [appActive, onWalletAppActiveChange, mnemonic])

  useEffect(() => {
    if (wallet && mnemonic) {
      reconnectToSocket(wallet, mnemonic)
    }
    return () => rifWalletServicesSocket.disconnect()
  }, [wallet, reconnectToSocket, mnemonic])

  return null
}
