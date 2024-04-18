import {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { getSdkError, parseUri } from '@walletconnect/utils'
import Web3Wallet, { Web3WalletTypes } from '@walletconnect/web3wallet'
import { IWeb3Wallet } from '@walletconnect/web3wallet'
import { WalletConnectAdapter } from '@rsksmart/rif-wallet-adapters'

import { ChainID } from 'lib/eoaWallet'
import { createPendingTxFromTxResponse } from 'lib/utils'

import {
  buildRskAllowedNamespaces,
  createWeb3Wallet,
  getProposalErrorComparedWithRskNamespace,
  WalletConnect2SdkErrorString,
} from 'screens/walletConnect/walletConnect2.utils'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectChainId } from 'store/slices/settingsSlice'
import { addPendingTransaction } from 'store/slices/transactionsSlice'
import { Wallet, addressToUse } from 'shared/wallet'

const onSessionApprove = async (
  web3wallet: Web3Wallet,
  proposal: Web3WalletTypes.SessionProposal,
  walletAddress: string,
  chainId: ChainID,
) => {
  try {
    const namespaces = buildRskAllowedNamespaces({
      proposal,
      chainId,
      walletAddress,
    })
    return await web3wallet.approveSession({
      id: proposal.id,
      namespaces,
    })
  } catch (error) {
    return 'Error while approving session' // This is for the developer
  }
}

const onSessionReject = async (
  web3wallet: Web3Wallet,
  proposal: Web3WalletTypes.SessionProposal,
  message?: WalletConnect2SdkErrorString,
) => {
  try {
    return await web3wallet.rejectSession({
      id: proposal.id,
      reason: getSdkError(message || 'USER_REJECTED'),
    })
  } catch (error) {
    return 'Error while rejecting session' // This is for the developer
  }
}

const isWcUriValid = (uri: string): boolean => {
  const { topic, protocol, version } = parseUri(uri)
  if (version !== 2) {
    return false
  }
  if (protocol !== 'wc') {
    return false
  }
  return topic.length !== 0
}

export type SessionStruct = Awaited<ReturnType<IWeb3Wallet['approveSession']>>

interface PendingSession {
  web3wallet: Web3Wallet
  proposal: Web3WalletTypes.SessionProposal
}
// Do note that both title and message must exist in i18n.ts
interface ErrorForAlertUsingTranslation {
  title: string
  message: string
}

interface WalletConnect2ContextArguments {
  sessions: SessionStruct[]
  onUserApprovedSession: () => Promise<string | void>
  onUserRejectedSession: () => Promise<string | void>
  onCreateNewSession: (uri: string) => Promise<void>
  onDisconnectSession: (session: SessionStruct) => Promise<void>
  pendingSession?: PendingSession
  error?: ErrorForAlertUsingTranslation
  setError: (error?: ErrorForAlertUsingTranslation) => void
}

export const WalletConnect2Context =
  createContext<WalletConnect2ContextArguments>({
    sessions: [],
    onCreateNewSession: async () => {},
    onUserApprovedSession: async () => {},
    onUserRejectedSession: async () => {},
    setError: () => {},
    onDisconnectSession: async () => {},
  })

interface WalletConnect2ProviderProps {
  children: ReactElement
  wallet: Wallet | null
}

export const WalletConnect2Provider = ({
  children,
  wallet,
}: WalletConnect2ProviderProps) => {
  const address = wallet ? addressToUse(wallet) : null
  const dispatch = useAppDispatch()
  const chainId = useAppSelector(selectChainId)
  const [sessions, setSessions] = useState<SessionStruct[]>([])
  const [pendingSession, setPendingSession] = useState<
    PendingSession | undefined
  >(undefined)
  const [error, setError] = useState<WalletConnect2ContextArguments['error']>()
  const [web3wallet, setWeb3Wallet] = useState<Web3Wallet | null>(null)

  const onSessionProposal = async (
    proposal: Web3WalletTypes.SessionProposal,
    usersWallet: Web3Wallet,
  ) => {
    console.log('onSessionProposal', proposal)

    const hasErrors = getProposalErrorComparedWithRskNamespace(proposal)
    if (hasErrors) {
      await onSessionReject(usersWallet, proposal, hasErrors)
      setError({
        title: 'dapps_session_rejected',
        message: 'dapps_requirements_not_met',
      })
    } else {
      // Set to pendingSession
      // So that when the user confirms/rejects the session (done in WalletConnectScreen)
      // then it'll use this session accordingly
      setPendingSession({
        web3wallet: usersWallet,
        proposal,
      })
    }
  }

  const subscribeToEvents = useCallback(
    (usersWallet: Web3Wallet, _wallet: Wallet) => {
      usersWallet.on('session_proposal', async proposal =>
        onSessionProposal(proposal, usersWallet),
      )
      usersWallet.on('session_request', async event => {
        if (!_wallet) {
          return
        }
        const adapter = new WalletConnectAdapter(_wallet)
        const eth_signTypedDataResolver = adapter
          .getResolvers()
          .find(
            (resolver: { methodName: string }) =>
              resolver.methodName === 'eth_signTypedData',
          )
        if (eth_signTypedDataResolver) {
          eth_signTypedDataResolver.validate = ({ domain }) => {
            // if address = relay address - throw error
            const { verifyingContract } = domain
            if (
              [address?.toLowerCase()].includes(verifyingContract.toLowerCase())
            ) {
              throw new Error(
                'Error: Unauthorized Contract Address - Signing not permitted. This address is exclusive to the relay contract.',
              )
            }
          }
        }

        const {
          params: {
            request: { method, params },
          },
          id,
          topic,
        } = event

        const rpcResponse = {
          topic,
          response: {
            id,
            jsonrpc: '2.0',
          },
        }
        adapter
          .handleCall(method, params)
          .then(async signedMessage => {
            if (method === 'eth_sendTransaction' && address) {
              const pendingTx = await createPendingTxFromTxResponse(
                signedMessage,
                {
                  chainId,
                  from: address,
                  to: params[0].to,
                },
              )
              if (pendingTx) {
                dispatch(addPendingTransaction(pendingTx))
              }
            }
            usersWallet.respondSessionRequest({
              ...rpcResponse,
              response: {
                ...rpcResponse.response,
                result: signedMessage,
              },
            })
          })
          .catch(_ => {
            usersWallet.respondSessionRequest({
              ...rpcResponse,
              response: {
                ...rpcResponse.response,
                error: getSdkError('USER_REJECTED'),
              },
            })
          })
      })
      usersWallet.on('session_delete', async event => {
        setSessions(prevSessions =>
          prevSessions.filter(prevSession => prevSession.topic !== event.topic),
        )
      })
    },
    [chainId, dispatch, address],
  )

  const onCreateNewSession = useCallback(
    async (uri: string) => {
      if (web3wallet && wallet) {
        try {
          subscribeToEvents(web3wallet, wallet)
          // Refer to https://docs.walletconnect.com/2.0/reactnative/web3wallet/wallet-usage#session-requests

          if (!isWcUriValid(uri)) {
            setError({
              title: 'dapps_uri_not_valid_title',
              message: 'dapps_uri_not_valid_message',
            })
          } else {
            await web3wallet.core.pairing.pair({ uri })
          }
        } catch (e) {
          // This will handle: "Pairing already exists:"
          if (e instanceof Error || typeof e === 'string') {
            if (e.toString().includes('already exists')) {
              setError({
                title: 'dapps_error_pairing_title',
                message: 'dapps_error_pairing_message',
              })
              // NOTE: Left this logic here in case we need it in the future
              // User tried to use an OLD QR - try to connect
              // const proposals = web3wallet.getPendingSessionProposals()
              // If there are pending proposals, use the last one to connect
              // if (Array.isArray(proposals) && proposals.length > 0) {
              //   const lastProposal = proposals.pop()//
              //   onSessionProposal(
              //     {
              //       ...lastProposal,
              //       params: { requiredNamespaces: lastProposal.requiredNamespaces },
              //     },
              //     web3wallet,
              //   )
              // } else {
              //   // else disconnect the current pairing
              //   web3wallet.core.pairing.disconnect(parseUri(uri))
              // }
            }
          }
        }
      }
    },
    [subscribeToEvents, web3wallet, wallet],
  )

  const onUserApprovedSession = async () => {
    if (pendingSession && address) {
      const newSession = await onSessionApprove(
        pendingSession.web3wallet,
        pendingSession.proposal,
        address,
        chainId,
      )
      if (typeof newSession === 'string') {
        // @TODO Error occurred - handle it
        console.log(116, newSession)
      } else {
        setSessions(prevState => [...prevState, newSession])
      }
      setPendingSession(undefined)
    }
  }

  const onUserRejectedSession = async () => {
    if (pendingSession) {
      await onSessionReject(pendingSession.web3wallet, pendingSession.proposal)
      setPendingSession(undefined)
    }
  }

  const onDisconnectSession = useCallback(
    async (session: SessionStruct) => {
      if (web3wallet) {
        try {
          await web3wallet.disconnectSession({
            topic: session.topic,
            reason: getSdkError('USER_DISCONNECTED'),
          })
        } catch (err) {
          // @TODO handle error disconnecting
          console.log(319, 'WC2.0 error disconnect', err)
          console.log('Deleting session from MMKV Storage')
          Promise.all([
            web3wallet.engine.signClient.session.delete(
              session.topic,
              getSdkError('USER_DISCONNECTED'),
            ),
            web3wallet.core.pairing.disconnect({ topic: session.topic }),
          ]).catch(() => console.log(328, 'Failed to disconnect WC manually'))
        } finally {
          setSessions(prevSessions =>
            prevSessions.filter(
              prevSession => prevSession.topic !== session.topic,
            ),
          )
        }
      }
    },
    [web3wallet],
  )

  const onContextFirstLoad = useCallback(
    async (_wallet: Wallet) => {
      try {
        console.log('onContextFirstLoad')
        const newWeb3Wallet = await createWeb3Wallet()
        setWeb3Wallet(newWeb3Wallet)
        subscribeToEvents(newWeb3Wallet, _wallet)
        setSessions(Object.values(newWeb3Wallet.getActiveSessions()))
      } catch (err) {
        throw new Error(err)
      }
    },
    [subscribeToEvents],
  )

  /**
   * useEffect On first load, fetch previous saved sessions
   */
  useEffect(() => {
    if (wallet) {
      onContextFirstLoad(wallet).catch(console.log)
    }
  }, [wallet, onContextFirstLoad])

  return (
    <WalletConnect2Context.Provider
      value={{
        sessions,
        pendingSession,
        onUserApprovedSession,
        onUserRejectedSession,
        onCreateNewSession,
        error,
        setError,
        onDisconnectSession,
      }}>
      {children}
    </WalletConnect2Context.Provider>
  )
}
