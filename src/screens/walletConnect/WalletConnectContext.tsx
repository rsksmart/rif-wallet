import React, { useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { NavigationProp, ParamListBase } from '@react-navigation/core'
import { RIFWallet } from '../../lib/core'

export interface WalletConnectContextInterface {
  connector: WalletConnect | undefined
  createSession: (uri: string) => Promise<void>
}

export const WalletConnectContext =
  React.createContext<WalletConnectContextInterface>({
    connector: undefined,
    createSession: async () => {},
  })

interface WalletConnectProviderElementInterface {
  navigation: NavigationProp<ParamListBase>
  account: RIFWallet
}

export const WalletConnectProviderElement: React.FC<WalletConnectProviderElementInterface> =
  ({ children, navigation, account }) => {
    const [connector, setConnector] = useState<WalletConnect | undefined>(
      undefined,
    )

    const subscribeToEvents = async (wc: WalletConnect) => {
      wc.on('session_request', async (error, payload) => {
        console.log('EVENT', 'session_request')

        if (error) {
          throw error
        }

        const { peerMeta } = payload.params[0]

        console.log('peerMeta', peerMeta, payload)

        navigation.navigate('SessionRequest', { peerMeta, account })

        console.log('peerMeta', peerMeta, payload)
      })

      wc.on('session_update', error => {
        console.log('EVENT', 'session_update')

        if (error) {
          throw error
        }
      })

      wc.on('call_request', async (error, payload) => {
        console.log('EVENT', 'call_request', 'payload', payload)

        if (error) {
          throw error
        }
      })

      wc.on('connect', error => {
        console.log('EVENT', 'connect')

        if (error) {
          throw error
        }
      })

      wc.on('disconnect', error => {
        console.log('EVENT', 'disconnect')

        if (error) {
          throw error
        }
      })
    }

    const createSession = async (uri: string) => {
      const newConnector = new WalletConnect({
        // Required
        uri,
        // Required
        clientMeta: {
          description: 'sWallet App',
          url: 'https://walletconnect-bridge.rifos.org/',
          icons: [
            'https://raw.githubusercontent.com/rsksmart/rif-scheduler-ui/develop/src/assets/logoColor.svg',
          ],
          name: 'sWalletApp',
        },
      })

      if (!newConnector.connected) {
        console.log('createSession')

        subscribeToEvents(newConnector)

        await newConnector.createSession()

        setConnector(newConnector)
      }
    }

    const initialContext: WalletConnectContextInterface = {
      connector,
      createSession,
    }

    return (
      <WalletConnectContext.Provider value={initialContext}>
        {children}
      </WalletConnectContext.Provider>
    )
  }
