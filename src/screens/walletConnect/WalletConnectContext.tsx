import React, { useMemo, useState } from 'react'
import WalletConnect from '@walletconnect/client'
import { ParamListBase } from '@react-navigation/core'
import { RIFWallet } from '../../lib/core'
import { StackNavigationProp } from '@react-navigation/stack'
import { WalletConnectAdapter } from '../../lib/walletAdapters/WalletConnectAdapter'

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
  navigation: StackNavigationProp<ParamListBase>
  account: RIFWallet
}

export const WalletConnectProviderElement: React.FC<WalletConnectProviderElementInterface> =
  ({ children, navigation, account }) => {
    const [connector, setConnector] = useState<WalletConnect | undefined>(
      undefined,
    )

    const adapter = useMemo(() => new WalletConnectAdapter(account), [account])

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
        if (error) {
          throw error
        }

        console.log('peerId 2', wc.peerId, wc.clientId)

        const { id, method, params } = payload

        try {
          const result = await adapter.handleCall(method, params)

          console.log('result', result)

          const requestToApprove = { id, result }

          console.log('requestToApprove', requestToApprove)

          await connector?.approveRequest(requestToApprove)
        } catch (err) {
          console.error(err)
          await connector?.rejectRequest({ id })
        }

        console.log('EVENT', 'call_request', 'payload', id, method, params)
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
        uri: 'wc:0830fc6a-066d-4281-b0ae-38e616964b72@1?bridge=https%3A%2F%2Fwalletconnect-bridge.rifos.org%2F&key=ce885503b89248fe8a5694f02d51afb8651380b25f5c5030c0a155c815728150',
      })

      if (!newConnector.connected) {
        console.log('createSession')

        // await newConnector.createSession()

        console.log('peerId 1', newConnector.peerId, newConnector.clientId)

        subscribeToEvents(newConnector)

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
