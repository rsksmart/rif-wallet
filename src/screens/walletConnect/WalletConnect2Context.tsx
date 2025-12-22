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
import {
  SignTypedDataResolver,
  SendTransactionResolver,
  PersonalSignResolver,
} from '@rsksmart/rif-wallet-adapters/dist/resolvers'

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

import { WalletConnectSigningModal } from './WalletConnectSigningModal'
import {
  DomainValidationParams,
  WalletConnectSigningRequest,
  SecureSignTypedDataV4Resolver,
} from './types'

// Methods that require user consent before signing
export const SIGNING_METHODS = [
  'eth_signTypedData',
  'eth_signTypedData_v4',
  'personal_sign',
  'eth_sign',
]

// Methods that are allowed for WalletConnect sessions
export const ALLOWED_SESSION_METHODS = [
  'eth_sendTransaction',
  'personal_sign',
  'eth_signTransaction',
  'eth_signTypedData',
  'eth_signTypedData_v4',
]

/**
 * Validates that the requested method is allowed for the session
 * @param sessionMethods - Methods approved in the WalletConnect session
 * @param method - The method being requested
 * @returns true if the method is allowed, false otherwise
 */
export const isMethodAllowedForSession = (
  sessionMethods: string[] | undefined,
  method: string,
): boolean => {
  if (!sessionMethods) {
    return false
  }

  // Check if method is in our allowed list
  if (!ALLOWED_SESSION_METHODS.includes(method)) {
    return false
  }

  // Check if method was approved in the session namespaces
  return sessionMethods.includes(method)
}

/**
 * Creates a domain validator function that blocks signing for protected addresses
 * This prevents attackers from harvesting ForwardRequest signatures for the Smart Wallet
 */
export const createDomainValidator = (protectedAddress: string | null) => {
  return ({ domain }: DomainValidationParams) => {
    if (!protectedAddress) {
      return
    }

    const { verifyingContract } = domain
    if (!verifyingContract) {
      return
    }

    // Block if the verifying contract matches the protected address (Smart Wallet)
    if (verifyingContract.toLowerCase() === protectedAddress.toLowerCase()) {
      throw new Error(
        'Error: Unauthorized Contract Address - Signing not permitted. This address is exclusive to the relay contract.',
      )
    }
  }
}

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

interface PendingSignRequest {
  event: Web3WalletTypes.SessionRequest
  adapter: WalletConnectAdapter
  request: WalletConnectSigningRequest
  resolve: (value: unknown) => void
  reject: (reason?: unknown) => void
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
  const [pendingSignRequest, setPendingSignRequest] = useState<
    PendingSignRequest | undefined
  >(undefined)
  const [error, setError] = useState<WalletConnect2ContextArguments['error']>()
  const [web3wallet, setWeb3Wallet] = useState<Web3Wallet | null>(null)

  /**
   * Creates a WalletConnectAdapter with proper security configurations:
   * 1. Includes both SignTypedDataResolver and SecureSignTypedDataV4Resolver
   * 2. Applies domain validation to BOTH resolvers to prevent ForwardRequest attacks
   *
   * Note: We use a custom SecureSignTypedDataV4Resolver because the library's
   * SignTypedDataV4Resolver doesn't call validate() in its resolve method.
   */
  const createSecureAdapter = useCallback(
    (_wallet: Wallet) => {
      // Cast wallet for resolver constructors - safe because our wallet implements required methods
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const walletForResolvers = _wallet as any

      // Create domain validator for protecting Smart Wallet address
      const domainValidator = createDomainValidator(address)

      // Create SignTypedDataResolver with validation
      const signTypedDataResolver = new SignTypedDataResolver(
        walletForResolvers,
      )
      signTypedDataResolver.validate = domainValidator

      // Create custom V4 resolver with validation
      // (Library's SignTypedDataV4Resolver doesn't call validate() - this is the security fix)
      const signTypedDataV4Resolver = new SecureSignTypedDataV4Resolver(
        walletForResolvers,
      )
      signTypedDataV4Resolver.validate = domainValidator

      // Create adapter with all resolvers including secure V4
      const resolvers = [
        new SendTransactionResolver(walletForResolvers),
        new PersonalSignResolver(walletForResolvers),
        signTypedDataResolver,
        signTypedDataV4Resolver,
      ]

      return new WalletConnectAdapter(walletForResolvers, resolvers)
    },
    [address],
  )

  /**
   * Validates that the requested method is allowed for the session
   * Wrapper that extracts methods from SessionStruct and uses the exported validator
   */
  const checkMethodAllowedForSession = useCallback(
    (session: SessionStruct | undefined, method: string): boolean => {
      if (!session) {
        return false
      }
      const sessionMethods = session.namespaces?.eip155?.methods || []
      return isMethodAllowedForSession(sessionMethods, method)
    },
    [],
  )

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

  /**
   * Handles user confirmation of a signing request
   */
  const onUserConfirmSign = useCallback(async () => {
    if (!pendingSignRequest) {
      return
    }

    const { event, adapter, resolve, reject } = pendingSignRequest
    const {
      params: {
        request: { method, params },
      },
    } = event

    try {
      const result = await adapter.handleCall(method, params)
      resolve(result)
    } catch (err) {
      reject(err)
    } finally {
      setPendingSignRequest(undefined)
    }
  }, [pendingSignRequest])

  /**
   * Handles user rejection of a signing request
   */
  const onUserRejectSign = useCallback(() => {
    if (!pendingSignRequest) {
      return
    }

    pendingSignRequest.reject(new Error('User rejected'))
    setPendingSignRequest(undefined)
  }, [pendingSignRequest])

  const subscribeToEvents = useCallback(
    (usersWallet: Web3Wallet, _wallet: Wallet) => {
      usersWallet.on('session_proposal', async proposal =>
        onSessionProposal(proposal, usersWallet),
      )

      usersWallet.on('session_request', async event => {
        if (!_wallet) {
          return
        }

        const {
          params: {
            request: { method, params },
          },
          id,
          topic,
        } = event

        // Get the session for this request
        const session = sessions.find(s => s.topic === topic)

        // Validate method is allowed for this session
        if (!checkMethodAllowedForSession(session, method)) {
          console.warn(
            `WalletConnect: Unauthorized method ${method} for session`,
          )
          await usersWallet.respondSessionRequest({
            topic,
            response: {
              id,
              jsonrpc: '2.0',
              error: getSdkError('UNAUTHORIZED_METHOD'),
            },
          })
          return
        }

        // Create secure adapter with validated resolvers
        const adapter = createSecureAdapter(_wallet)

        const rpcResponse = {
          topic,
          response: {
            id,
            jsonrpc: '2.0',
          },
        }

        // For signing methods, show confirmation UI and wait for user consent
        if (SIGNING_METHODS.includes(method)) {
          // Get dApp info from session
          const dappName = session?.peer?.metadata?.name
          const dappUrl = session?.peer?.metadata?.url

          // Create a promise that will be resolved when user confirms/rejects
          const signPromise = new Promise((resolve, reject) => {
            setPendingSignRequest({
              event,
              adapter,
              request: {
                method,
                params: params as unknown[],
                dappName,
                dappUrl,
              },
              resolve,
              reject,
            })
          })

          signPromise
            .then(async signedMessage => {
              await usersWallet.respondSessionRequest({
                ...rpcResponse,
                response: {
                  ...rpcResponse.response,
                  result: signedMessage,
                },
              })
            })
            .catch(async err => {
              console.log('WalletConnect signing rejected:', err)
              await usersWallet.respondSessionRequest({
                ...rpcResponse,
                response: {
                  ...rpcResponse.response,
                  error: getSdkError('USER_REJECTED'),
                },
              })
            })

          return
        }

        // For non-signing methods, proceed directly
        adapter
          .handleCall(method, params)
          .then(async signedMessage => {
            if (method === 'eth_sendTransaction' && address) {
              const pendingTx = await createPendingTxFromTxResponse(
                signedMessage,
                {
                  chainId,
                  from: address,
                  to: (params as Array<{ to: string }>)[0].to,
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
    [
      chainId,
      dispatch,
      address,
      sessions,
      createSecureAdapter,
      checkMethodAllowedForSession,
    ],
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
        throw new Error(err as string)
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
      {/* Signing Confirmation Modal - Shows for WalletConnect signing requests */}
      {pendingSignRequest && (
        <WalletConnectSigningModal
          request={pendingSignRequest.request}
          onConfirm={onUserConfirmSign}
          onReject={onUserRejectSign}
        />
      )}
    </WalletConnect2Context.Provider>
  )
}
