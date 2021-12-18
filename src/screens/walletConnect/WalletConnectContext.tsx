import React, { useMemo, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { ParamListBase } from '@react-navigation/core'
import { RIFWallet } from '../../lib/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'
import {
  saveWCSession,
  deleteWCSession,
  getWCSession,
  hasWCSession,
} from '../../storage/WalletConnectSessionStore'

export interface WalletConnectContextInterface {
  connector: WalletConnect | null
  peerMeta: any
  createSession: (uri: string, session?: any) => Promise<void>
  handleApprove: () => Promise<void>
  handleReject: () => Promise<void>
  reconnectSession: () => Promise<void>
}

export const WalletConnectContext =
  React.createContext<WalletConnectContextInterface>({
    connector: null,
    peerMeta: null,
    createSession: async () => {},
    handleApprove: async () => {},
    handleReject: async () => {},
    reconnectSession: async () => {},
  })

interface WalletConnectProviderElementInterface {
  navigation: StackNavigationProp<ParamListBase>
  account: RIFWallet
}

export const WalletConnectProviderElement: React.FC<WalletConnectProviderElementInterface> =
  ({ children, navigation, account }) => {
    const [connector, setConnector] = useState<WalletConnect | null>(null)

    const [peerMeta, setPeerMeta] = useState<any>(null)

    const adapter = useMemo(() => new WalletConnectAdapter(account), [account])

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

    const subscribeToEvents = async (wc: WalletConnect) => {
      unsubscribeToEvents(wc)

      wc.on('session_request', async (error, payload) => {
        console.log('EVENT', 'session_request', error, payload)

        if (error) {
          throw error
        }

        const { peerMeta: sessionPeerMeta } = payload.params[0]

        setPeerMeta(sessionPeerMeta)

        navigation.navigate('SessionRequest')
      })

      wc.on('call_request', async (error, payload) => {
        if (error) {
          throw error
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

        navigation.navigate('Home')
      })
    }

    const handleApprove = async () => {
      if (!connector) {
        return
      }

      connector.approveSession({
        accounts: [account.address],
        chainId: await account.getChainId(),
      })

      await saveWCSession({ uri: connector.uri, session: connector.session })

      subscribeToEvents(connector)

      navigation.navigate('Connected')
    }

    const handleReject = async () => {
      if (!connector) {
        return
      }

      connector.rejectSession({ message: 'user rejected the session' })
    }

    const createSession = async (uri: string, session?: any) => {
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

      setPeerMeta(newConnector.peerMeta)

      // needs to subscribe to events before createSession
      // this is because we need the 'session_request' event
      subscribeToEvents(newConnector)

      setConnector(newConnector)
    }

    const reconnectSession = async () => {
      const hasPrevSession = await hasWCSession()

      if (!hasPrevSession) {
        return
      }

      const { uri, session } = await getWCSession()

      await createSession(uri, session)

      navigation.navigate('Connected')
    }

    const initialContext: WalletConnectContextInterface = {
      connector,
      peerMeta,
      createSession,
      handleApprove,
      handleReject,
      reconnectSession,
    }

    return (
      <WalletConnectContext.Provider value={initialContext}>
        {children}
      </WalletConnectContext.Provider>
    )
  }
