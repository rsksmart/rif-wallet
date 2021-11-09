import React, { useMemo, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { ParamListBase } from '@react-navigation/core'
import { RIFWallet } from '../../lib/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'

export interface WalletConnectContextInterface {
  connector: WalletConnect | null
  peerMeta: any
  createSession: (uri: string) => Promise<void>
  handleApprove: () => Promise<void>
  handleReject: () => Promise<void>
}

export const WalletConnectContext =
  React.createContext<WalletConnectContextInterface>({
    connector: null,
    peerMeta: null,
    createSession: async () => {},
    handleApprove: async () => {},
    handleReject: async () => {},
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

    const subscribeToEvents = async (wc: WalletConnect) => {
      const eventsNames = [
        'session_request',
        'session_update',
        'call_request',
        'connect',
        'disconnect',
      ]

      eventsNames.forEach(x => wc.off(x))

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

        try {
          const result = await adapter.handleCall(method, params)

          connector?.approveRequest({ id, result })
        } catch (err) {
          console.error(err)
          connector?.rejectRequest({ id })
        }
      })

      wc.on('disconnect', async error => {
        console.log('EVENT', 'disconnect', error)

        setConnector(null)
        setPeerMeta(null)
        try {
          await connector?.killSession()
        } catch (err) {
          console.error('could not kill the wc session', err)
        }
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

      subscribeToEvents(connector)

      navigation.navigate('Connected')
    }

    const handleReject = async () => {
      if (!connector) {
        return
      }

      connector.rejectSession({ message: 'user rejected the session' })
    }

    const createSession = async (uri: string) => {
      const newConnector = new WalletConnect({
        // Required
        uri,
        // Required
        clientMeta: {
          description: 'sWallet App',
          url: 'https://www.rifos.org/',
          icons: [
            'https://raw.githubusercontent.com/rsksmart/rif-scheduler-ui/develop/src/assets/logoColor.svg',
          ],
          name: 'sWalletApp',
        },
      })

      // needs to subscribe to events before createSession
      // this is because we need the 'session_request' event
      subscribeToEvents(newConnector)

      setConnector(newConnector)
    }

    const initialContext: WalletConnectContextInterface = {
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
