import { useNavigation } from '@react-navigation/core'
import WalletConnect from '@walletconnect/client'
import {
  useContext,
  useEffect,
  useState,
  createContext,
  ReactElement,
} from 'react'
import { AppContext } from '../../Context'
import { RIFWallet } from 'lib/core'
import { WalletConnectAdapter } from 'lib/walletAdapters/WalletConnectAdapter'
import {
  deleteWCSession,
  getWCSession,
  IWCSession,
  saveWCSession,
} from '../../storage/WalletConnectSessionStore'

export interface WalletConnectContextInterface {
  connections: IWalletConnectConnections
  createSession: (wallet: RIFWallet, uri: string, session?: IWCSession) => void
  handleApprove: (wc: WalletConnect, wallet: RIFWallet) => Promise<void>
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
  const navigation = useNavigation()

  const [connections, setConnections] = useState<IWalletConnectConnections>({})

  const { wallets } = useContext(AppContext)

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

  const subscribeToEvents = (
    wc: WalletConnect,
    adapter: WalletConnectAdapter,
  ) => {
    unsubscribeToEvents(wc)

    wc.on('session_request', async (error, payload) => {
      console.log('EVENT', 'session_request', error, payload)

      if (error) {
        throw error
      }

      navigation.navigate('WalletConnect' as never, { wcKey: wc.key } as never)
    })

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
      await deleteWCSession(wc.uri)
      setConnections(prev => {
        const result = { ...prev }
        delete result[wc.key]
        return result
      })
    })
  }

  const handleApprove = async (wc: WalletConnect, wallet: RIFWallet) => {
    if (wc) {
      wc.approveSession({
        accounts: [wallet.smartWalletAddress],
        chainId: await wallet.getChainId(),
      })

      await saveWCSession({
        key: wc.key,
        uri: wc.uri,
        session: wc.session,
        walletAddress: wallet.address,
      })

      const adapter = new WalletConnectAdapter(wallet)

      subscribeToEvents(wc, adapter)
      navigation.navigate('WalletConnect' as never)
    }
  }

  const handleReject = (wc: WalletConnect) => {
    if (wc) {
      wc.rejectSession({ message: 'user rejected the session' })
      navigation.navigate('WalletConnect' as never)
    }
  }

  const createSession = (
    wallet: RIFWallet,
    uri: string,
    session?: IWCSession,
  ) => {
    try {
      const newConnector = new WalletConnect({
        uri,
        session,
        clientMeta: {
          description: 'RIF Wallet',
          url: 'https://www.rifos.org/',
          icons: [
            'https://raw.githubusercontent.com/rsksmart/rif-scheduler-ui/develop/src/assets/logoColor.svg',
          ],
          name: 'RIF Wallet',
        },
      })

      const adapter = new WalletConnectAdapter(wallet)

      // needs to subscribe to events before createSession
      // this is because we need the 'session_request' event
      subscribeToEvents(newConnector, adapter)

      setConnections(prev => ({
        ...prev,
        [newConnector.key]: {
          connector: newConnector,
          address: wallet.address,
        },
      }))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    const reconnectWCSession = async () => {
      const storedSessions = getWCSession()

      if (!storedSessions) {
        return
      }

      const sessions = Object.values(storedSessions)

      for (const { walletAddress, uri, session } of sessions) {
        try {
          const wallet = wallets[walletAddress]
          if (wallet) {
            createSession(wallet, uri, session)
          }
        } catch (error) {
          console.error('reconnect wc error: ', error)
          deleteWCSession(uri)
        }
      }
    }

    reconnectWCSession()
  }, [wallets])

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
