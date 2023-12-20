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
import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { AbiEnhancer } from '@rsksmart/rif-wallet-abi-enhancer'
import moment from 'moment'

import {
  buildRskAllowedNamespaces,
  createWeb3Wallet,
  getProposalErrorComparedWithRskNamespace,
  WalletConnect2SdkErrorString,
} from 'screens/walletConnect/walletConnect2.utils'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectChainId } from 'store/slices/settingsSlice'
import {
  addPendingTransaction,
  ApiTransactionWithExtras,
} from 'store/slices/transactionsSlice'
import { createPendingTxFromWcResponse } from 'src/lib/utils'

const onSessionApprove = async (
  web3wallet: Web3Wallet,
  proposal: Web3WalletTypes.SessionProposal,
  walletAddress: string,
  chainId: ChainTypesByIdType,
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
  wallet: RIFWallet | null
}

export const WalletConnect2Provider = ({
  children,
  wallet,
}: WalletConnect2ProviderProps) => {
  const chainId = useAppSelector(selectChainId)
  const [sessions, setSessions] = useState<SessionStruct[]>([])
  const [pendingSession, setPendingSession] = useState<
    PendingSession | undefined
  >(undefined)
  const [error, setError] = useState<WalletConnect2ContextArguments['error']>()
  const dispatch = useAppDispatch()

  const onSessionProposal = async (
    proposal: Web3WalletTypes.SessionProposal,
    web3wallet: Web3Wallet,
  ) => {
    const hasErrors = getProposalErrorComparedWithRskNamespace(proposal)
    if (hasErrors) {
      await onSessionReject(web3wallet, proposal, hasErrors)
      setError({
        title: 'dapps_session_rejected',
        message: 'dapps_requirements_not_met',
      })
    } else {
      // Set to pendingSession
      // So that when the user confirms/rejects the session (done in WalletConnectScreen)
      // then it'll use this session accordingly
      setPendingSession({
        web3wallet,
        proposal,
      })
    }
  }

  const subscribeToEvents = useCallback(
    (web3wallet: Web3Wallet) => {
      web3wallet.on('session_proposal', async proposal =>
        onSessionProposal(proposal, web3wallet),
      )
      web3wallet.on('session_request', async event => {
        if (!wallet) {
          return
        }
        const adapter = new WalletConnectAdapter(wallet)
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
              [
                wallet.smartWalletAddress.toLowerCase(),
                wallet.rifRelaySdk.smartWalletFactory.address.toLowerCase(),
              ].includes(verifyingContract.toLowerCase())
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
            if (method === 'eth_sendTransaction') {
              const pendingTx = await createPendingTxFromWcResponse(
                signedMessage,
                {
                  chainId,
                  from: wallet.smartWalletAddress,
                  to: params[0].to,
                },
              )
              if (pendingTx) {
                dispatch(addPendingTransaction(pendingTx))
              }
            }
            web3wallet.respondSessionRequest({
              ...rpcResponse,
              response: {
                ...rpcResponse.response,
                result: signedMessage,
              },
            })
          })
          .catch(_ => {
            web3wallet.respondSessionRequest({
              ...rpcResponse,
              response: {
                ...rpcResponse.response,
                error: getSdkError('USER_REJECTED'),
              },
            })
          })
      })
      web3wallet.on('session_delete', async event => {
        setSessions(prevSessions =>
          prevSessions.filter(prevSession => prevSession.topic !== event.topic),
        )
      })
    },
    [chainId, dispatch, wallet],
  )

  const onCreateNewSession = async (uri: string) => {
    try {
      const web3wallet = await createWeb3Wallet()
      subscribeToEvents(web3wallet)
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

  const onUserApprovedSession = async () => {
    if (pendingSession && wallet) {
      const newSession = await onSessionApprove(
        pendingSession.web3wallet,
        pendingSession.proposal,
        wallet.smartWalletAddress,
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

  const onDisconnectSession = async (session: SessionStruct) => {
    try {
      const web3wallet = await createWeb3Wallet()
      await web3wallet.disconnectSession({
        topic: session.topic,
        reason: getSdkError('USER_DISCONNECTED'),
      })
      setSessions(prevSessions =>
        prevSessions.filter(prevSession => prevSession.topic !== session.topic),
      )
    } catch (err) {
      // @TODO handle error disconnecting
      console.log('WC2.0 error disconnect', err)
    }
  }

  const onContextFirstLoad = useCallback(async () => {
    const web3wallet = await createWeb3Wallet()
    subscribeToEvents(web3wallet)
    setSessions(Object.values(web3wallet.getActiveSessions()))
  }, [subscribeToEvents])

  /**
   * useEffect On first load, fetch previous saved sessions
   */
  useEffect(() => {
    if (wallet) {
      onContextFirstLoad().catch(console.log)
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
