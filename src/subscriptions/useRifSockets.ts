import { useCallback, useEffect, useMemo } from 'react'

import { RIFWallet } from 'lib/core'

import { useSetGlobalError } from 'components/GlobalErrorHandler'
import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { useAppDispatch } from 'store/storeUtils'
import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { rifWalletServicesSocket, abiEnhancer } from 'core/setup'
import { Action, InitAction } from './types'
import { RifWalletServicesFetcher } from 'src/lib/rifWalletServices/RifWalletServicesFetcher'

interface IUseRifSockets {
  appActive: boolean
  wallet: RIFWallet | null
  mnemonic: string | null
  fetcher?: RifWalletServicesFetcher
}
export const useRifSockets = ({
  appActive,
  wallet,
  mnemonic,
  fetcher,
}: IUseRifSockets) => {
  const dispatch = useAppDispatch()
  const setGlobalError = useSetGlobalError()
  const onChange = useMemo(
    () =>
      wallet
        ? onSocketChangeEmitted({
            dispatch,
            abiEnhancer,
            wallet,
          })
        : null,
    [wallet, dispatch],
  )

  const onSocketInit = useCallback(
    (payload: InitAction['payload'], cb: (action: Action) => void) => {
      cb({ type: 'init', payload })
    },
    [],
  )

  const onSocketError = useCallback(
    () => setGlobalError('Error connecting to the socket'),
    [setGlobalError],
  )

  useEffect(() => {
    if (!appActive) {
      return rifWalletServicesSocket.disconnect()
    }

    if (wallet && onChange && mnemonic && fetcher) {
      if (rifWalletServicesSocket.isConnected()) {
        rifWalletServicesSocket.disconnect()
        dispatch(resetSocketState())
      }

      rifWalletServicesSocket.on('init', payload =>
        onSocketInit(payload, onChange),
      )
      rifWalletServicesSocket.on('change', onChange)
      rifWalletServicesSocket
        .connect(wallet, mnemonic, fetcher)
        .catch(onSocketError)
    }
  }, [
    appActive,
    wallet,
    mnemonic,
    onChange,
    fetcher,
    onSocketError,
    onSocketInit,
    dispatch,
  ])

  return null
}
