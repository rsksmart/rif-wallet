import { useNavigation } from '@react-navigation/core'
import WalletConnect from '@walletconnect/client'
import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../../Context'
import { RIFWallet } from '../../lib/core'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'
import {
  deleteWCSession,
  getWCSession,
  saveWCSession,
} from '../../storage/WalletConnectSessionStore'

export interface WalletConnectContextInterface {
  connections: IWalletConnectConnections
  createSession: (wallet: RIFWallet, uri: string, session?: any) => void
  handleApprove: (wc: WalletConnect, wallet: RIFWallet) => Promise<void>
  handleReject: (wc: WalletConnect) => Promise<void>
}

export const WalletConnectContext =
  React.createContext<WalletConnectContextInterface>({
    connections: {},
    createSession: () => {},
    handleApprove: async () => {},
    handleReject: async () => {},
  })

export interface IWalletConnectConnections {
  [key: string]: {
    connector: WalletConnect
    address: string
  }
}

export const WalletConnectProviderElement: React.FC = ({ children }) => {
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

  const subscribeToEvents = async (
    wc: WalletConnect,
    adapter: WalletConnectAdapter,
  ) => {
    unsubscribeToEvents(wc)

    wc.on('session_request', async (error, payload) => {
      console.log('EVENT', 'session_request', error, payload)

      if (error) {
        throw error
      }

      navigation.navigate('Dapps' as never, { wcKey: wc.key } as never)
    })

    wc.on('call_request', async (error, payload) => {
      if (error) {
        throw error
      }
      if (!adapter) {
        throw new Error('Missing adapter')
      }

      const { id, method, params } = payload

      adapter
        .handleCall(method, params)
        .then((result: any) => wc?.approveRequest({ id, result }))
        .catch((errorReason: string) =>
          wc?.rejectRequest({ id, error: { message: errorReason } }),
        )
    })

    wc.on('disconnect', async error => {
      console.log('EVENT', 'disconnect', error)

      setConnections(prev => {
        const result = { ...prev }

        delete result[wc.key]

        return result
      })

      unsubscribeToEvents(wc)

      await deleteWCSession(wc.uri)

      try {
        await wc?.killSession()
      } catch (err) {
        console.error('could not kill the wc session', err)
      }
    })
  }

  const handleApprove = async (wc: WalletConnect, wallet: RIFWallet) => {
    if (!wc) {
      return
    }

    wc.approveSession({
      accounts: [wallet.smartWalletAddress],
      chainId: await wallet.getChainId(),
    })

    await saveWCSession({
      uri: wc.uri,
      session: wc.session,
      walletAddress: wallet.address,
    })

    const adapter = new WalletConnectAdapter(wallet)

    subscribeToEvents(wc, adapter)

    navigation.navigate('Connected' as never, { wcKey: wc.key } as never)
  }

  const handleReject = async (wc: WalletConnect) => {
    if (!wc) {
      return
    }

    wc.rejectSession({ message: 'user rejected the session' })
  }

  const createSession = (wallet: RIFWallet, uri: string, session?: any) => {
    const newConnector = new WalletConnect({
      uri,
      session,
      clientMeta: {
        description: 'sWallet App',
        url: 'https://www.rifos.org/',
        icons: [
          'https://raw.githubusercontent.com/rsksmart/rif-scheduler-ui/develop/src/assets/logoColor.svg',
        ],
        name: 'sWalletApp',
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
  }

  useEffect(() => {
    const reconnectWCSession = async () => {
      const storedSessions = await getWCSession()

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
          await deleteWCSession(uri)
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
