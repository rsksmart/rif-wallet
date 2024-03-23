import EventEmitter from 'eventemitter3'
import {
  ITokenWithBalance,
  RifWalletServicesSocket,
} from '@rsksmart/rif-wallet-services'
import DeviceInfo from 'react-native-device-info'
import Config from 'react-native-config'

import { ChainID } from 'lib/eoaWallet'

import { resetSocketState } from 'store/shared/actions/resetSocketState'
import { AppDispatch } from 'store/index'
import { abiEnhancer } from 'core/setup'
import { addOrUpdateBalances } from 'store/slices/balancesSlice'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import { UsdPricesState } from 'store/slices/usdPricesSlice'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { MMKVStorage } from 'storage/MMKVStorage'
import { getDefaultTokens } from 'shared/utils'

import { onSocketChangeEmitted } from './onSocketChangeEmitted'
import { Action, InitAction } from './types'

export const socketsEvents = new EventEmitter()

export enum SocketsEvents {
  CONNECT = 'CONNECT',
  DISCONNECT = 'DISCONNECT',
}

interface RifSockets {
  address: string
  chainId: ChainID
  setGlobalError: (err: string) => void
  dispatch: AppDispatch
  usdPrices: UsdPricesState
  balances: Record<string, TokenBalanceObject>
}

const onSocketInit = (
  payload: InitAction['payload'],
  cb: (action: Action) => void,
) => {
  cb({ type: 'init', payload })
}

const cache = new MMKVStorage('txs')

export const rifSockets = ({
  address,
  chainId,
  dispatch,
  setGlobalError,
  usdPrices,
  balances,
}: RifSockets) => {
  const onChange = onSocketChangeEmitted({
    dispatch,
    abiEnhancer,
    usdPrices,
    chainId,
    cache,
  })
  const rifWalletServicesSocket = new RifWalletServicesSocket(
    getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL, chainId),
  )

  const connectSocket = () => {
    if (rifWalletServicesSocket.isConnected()) {
      rifWalletServicesSocket.disconnect()
      dispatch(resetSocketState())
    }

    const defaultTokens = getDefaultTokens(chainId)
    const defaultTokensWithBalance = defaultTokens.map(t => {
      const tokenBalance = balances[t.contractAddress]
      return {
        ...t,
        logo: '', // remove warning
        balance: tokenBalance?.balance ?? t.balance,
        usdBalance: tokenBalance?.usdBalance ?? t.usdBalance,
      } as ITokenWithBalance
    })
    dispatch(addOrUpdateBalances(defaultTokensWithBalance))

    rifWalletServicesSocket.removeAllListeners()

    rifWalletServicesSocket.on('init', async payload =>
      onSocketInit(payload, onChange),
    )
    rifWalletServicesSocket.on('change', onChange)
    try {
      const blockNumber = cache.get('blockNumber') || '0'
      rifWalletServicesSocket.connect(
        address,
        chainId,
        {
          'User-Agent': DeviceInfo.getUserAgentSync(),
          'x-trace-id': Config.TRACE_ID,
        },
        blockNumber,
      )
    } catch (err) {
      if (err instanceof Error) {
        setGlobalError(err.message)
      } else {
        setGlobalError('Error connecting to socket')
      }
    }
  }

  const disconnectSocket = rifWalletServicesSocket.disconnect

  socketsEvents.removeAllListeners()

  socketsEvents.on(SocketsEvents.CONNECT, connectSocket)

  socketsEvents.on(SocketsEvents.DISCONNECT, disconnectSocket)
}
