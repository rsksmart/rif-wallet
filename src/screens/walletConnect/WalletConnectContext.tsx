import React, { useContext, useEffect, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { RIFWallet } from '../../lib/core'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'
import {
  saveWCSession,
  deleteWCSession,
  getWCSession,
  hasWCSession,
} from '../../storage/WalletConnectSessionStore'
import { AppContext } from '../../Context'
import { useNavigation } from '@react-navigation/core'
import { Alert } from 'react-native'
export interface WalletConnectContextInterface {
  isConnected: boolean
  connector: WalletConnect | null
  peerMeta: any
  createSession: (
    wallet: RIFWallet,
    uri: string,
    session?: any,
  ) => Promise<void>
  handleApprove: (wallet: RIFWallet) => Promise<void>
  handleReject: () => Promise<void>
}

export const WalletConnectContext =
  React.createContext<WalletConnectContextInterface>({
    isConnected: false,
    connector: null,
    peerMeta: null,
    createSession: async () => {},
    handleApprove: async () => {},
    handleReject: async () => {},
  })

export const WalletConnectProviderElement: React.FC = ({ children }) => {
  const navigation = useNavigation()

  const { wallets } = useContext(AppContext)

  const [connector, setConnector] = useState<WalletConnect | null>(null)

  const [peerMeta, setPeerMeta] = useState<any>(null)

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

      const { peerMeta: sessionPeerMeta } = payload.params[0]

      setPeerMeta(sessionPeerMeta)

      navigation.navigate('SessionRequest' as any)
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
        .then((result: any) => connector?.approveRequest({ id, result }))
        .catch((errorReason: string) =>
          connector?.rejectRequest({ id, error: { message: errorReason } }),
        )
    })

    wc.on('disconnect', async error => {
      console.log('EVENT', 'disconnect', error)

      setConnector(null)
      setPeerMeta(null)

      unsubscribeToEvents(wc)

      await deleteWCSession()

      try {
        await connector?.killSession()
      } catch (err) {
        console.error('could not kill the wc session', err)
      }

      Alert.alert('You have disconnected from the dapp')
    })
  }

  const handleApprove = async (wallet: RIFWallet) => {
    if (!connector) {
      return
    }

    connector.approveSession({
      accounts: [wallet.smartWalletAddress],
      chainId: await wallet.getChainId(),
    })

    await saveWCSession({
      uri: connector.uri,
      session: connector.session,
      walletAddress: wallet.address,
    })

    const adapter = new WalletConnectAdapter(wallet)

    subscribeToEvents(connector, adapter)

    navigation.navigate('Connected' as any)
  }

  const handleReject = async () => {
    if (!connector) {
      return
    }

    connector.rejectSession({ message: 'user rejected the session' })
  }

  const createSession = async (
    wallet: RIFWallet,
    uri: string,
    session?: any,
  ) => {
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

    setPeerMeta(newConnector.peerMeta)

    // needs to subscribe to events before createSession
    // this is because we need the 'session_request' event
    subscribeToEvents(newConnector, adapter)

    setConnector(newConnector)
  }

  useEffect(() => {
    const reconnectWCSession = async () => {
      try {
        const hasPrevSession = await hasWCSession()

        if (!hasPrevSession) {
          return
        }

        const { uri, session, walletAddress } = await getWCSession()

        const wallet = wallets[walletAddress]

        if (!wallet) {
          return
        }

        await createSession(wallet, uri, session)
      } catch (error) {
        console.error('reconnect wc error: ', error)
        deleteWCSession()
      }
    }

    reconnectWCSession()
  }, [wallets])

  const initialContext: WalletConnectContextInterface = {
    isConnected: connector && peerMeta,
    connector,
    peerMeta,
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
