import { useNavigation } from '@react-navigation/core'
import WalletConnect from '@walletconnect/client'
import {
  useEffect,
  useState,
  createContext,
  ReactElement,
  useCallback,
} from 'react'
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { WalletConnectAdapter } from '@rsksmart/rif-wallet-adapters'

import {
  deleteWCSession,
  getWCSession,
  IWCSession,
  saveWCSession,
} from 'storage/WalletConnectSessionStore'
import { useAppSelector } from 'store/storeUtils'
import { selectWallets } from 'store/slices/settingsSlice'
import { navigationContainerRef } from 'src/core/Core'
import { rootTabsRouteNames } from 'src/navigation/rootNavigator'

export interface WalletConnectContextInterface {
  connections: IWalletConnectConnections
  createSession: (wallet: RIFWallet, uri: string, session?: IWCSession) => void
  handleApprove: (wc: WalletConnect, wallet: RIFWallet | null) => Promise<void>
  handleReject: (wc: WalletConnect) => void
}

export const WalletConnectContext =
  createContext<WalletConnectContextInterface>({
    connections: {},
    createSession: () => {},
    handleApprove: async () => {},
    handleReject: () => {},
  })

export interface IWalletConnectConnections {
  [key: string]: {
    connector: WalletConnect
    address: string
  }
}

interface Props {
  children: ReactElement
}

export const WalletConnectProviderElement = ({ children }: Props) => {
  const [connections, setConnections] = useState<IWalletConnectConnections>({})

  const wallets = useAppSelector(selectWallets)

  const unsubscribeToEvents = async (wc: WalletConnect) => {
    const eventsNames = [
      'session_request',
      'session_update',
      'call_request',
      'connect',
      'disconnect',
    ]

    eventsNames.forEach(x => wc.off(x))
  }

  const subsribeToSessionRequest = useCallback((wc: WalletConnect) => {
    console.log('SUBSCRIBING TO SESSION REQUEST', wc.peerId)

    wc.on('session_request', async (error, payload) => {
      console.log('EVENT', 'connect', error, payload)

      if (error) {
        throw error
      }

      navigationContainerRef.navigate(rootTabsRouteNames.WalletConnect, {
        pendingConnector: wc,
      })
    })
  }, [])

  const subscribeToEvents = useCallback(
    (wc: WalletConnect, adapter: WalletConnectAdapter) => {
      unsubscribeToEvents(wc)

      wc.on('call_request', async (error, payload) => {
        console.log('EVENT', 'call_request', error, payload)
        if (error) {
          throw error
        }
        if (!adapter) {
          throw new Error('Missing adapter')
        }

        const { id, method, params } = payload

        adapter
          .handleCall(method, params)
          .then(result => wc?.approveRequest({ id, result }))
          .catch((errorReason: string) =>
            wc?.rejectRequest({ id, error: { message: errorReason } }),
          )
      })

      wc.on('disconnect', async error => {
        console.log('EVENT', 'disconnect', error)
        if (error) {
          throw error
        }

        unsubscribeToEvents(wc)
        deleteWCSession(wc.uri)
        setConnections(prev => {
          const result = { ...prev }
          delete result[wc.key]
          return result
        })
      })
    },
    [],
  )

  const handleApprove = async (wc: WalletConnect, wallet: RIFWallet | null) => {
    if (wc && wallet) {
      console.log('APPROVING')

      console.log('WALLET SMART ADDRESS', wallet.smartWalletAddress)
      console.log('WALLET CONNECT PEER ID', wc.peerId, wc.peerMeta)

      wc.approveSession({
        accounts: [wallet.smartWalletAddress],
        chainId: await wallet.getChainId(),
      })

      saveWCSession({
        key: wc.key,
        uri: wc.uri,
        session: wc.session,
        walletAddress: wallet.address,
      })

      setConnections(prev => ({
        ...prev,
        [wc.key]: {
          connector: wc,
          address: wallet.address,
        },
      }))

      const adapter = new WalletConnectAdapter(wallet)

      subscribeToEvents(wc, adapter)
      // navigationContainerRef.navigate(rootTabsRouteNames.WalletConnect)
      console.log('APPROVED')
    }
  }

  const handleReject = (wc: WalletConnect) => {
    if (wc) {
      wc.rejectSession({ message: 'user rejected the session' })
      // navigationContainerRef.navigate(rootTabsRouteNames.WalletConnect)
    }
  }

  const createSession = useCallback(
    async (wallet: RIFWallet, uri: string, session?: IWCSession) => {
      console.log('CREATING SESSION')
      try {
        const newConnector = new WalletConnect({
          uri,
          clientMeta: {
            description: 'RIF Wallet',
            url: 'https://www.rifos.org/',
            icons: [
              'https://raw.githubusercontent.com/rsksmart/rif-scheduler-ui/develop/src/assets/logoColor.svg',
            ],
            name: 'RIF Wallet',
          },
        })

        subsribeToSessionRequest(newConnector)

        // const adapter = new WalletConnectAdapter(wallet)

        // needs to subscribe to events before createSession
        // this is because we need the 'session_request' event
        console.log('FINISHEDCREATING SESSION')
        return newConnector
      } catch (error) {
        console.error(error)
      }
    },
    [subsribeToSessionRequest],
  )

  useEffect(() => {
    const reconnectWCSession = async () => {
      const storedSessions = getWCSession()

      if (!storedSessions) {
        return
      }

      const sessions = Object.values(storedSessions)

      for (const { walletAddress, uri, session } of sessions) {
        try {
          const wallet = wallets ? wallets[walletAddress] : null
          if (wallet) {
            const connector = await createSession(wallet, uri, session)
            if (connector) {
              setConnections(prev => ({
                ...prev,
                [connector.key]: {
                  connector,
                  address: wallet.address,
                },
              }))
            }
          }
        } catch (error) {
          console.error('reconnect wc error: ', error)
          deleteWCSession(uri)
        }
      }
    }

    reconnectWCSession()
  }, [wallets, createSession])

  const initialContext: WalletConnectContextInterface = {
    connections,
    createSession,
    handleApprove,
    handleReject,
  }

  return (
    <WalletConnectContext.Provider value={initialContext}>
      {children}
    </WalletConnectContext.Provider>
  )
}
