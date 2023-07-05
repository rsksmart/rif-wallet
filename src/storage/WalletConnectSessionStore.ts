import { MainStorage } from './MainStorage'

const WC_KEY = 'WALLET_CONNECT_SESSION'

export interface IWCSession {
  key: string
  uri: string
  session: unknown // TODO: make IWalletConnectSession
  walletAddress: string
}

export interface ISessionsStorage {
  [key: string]: IWCSession
}

export const createStore = () => ({
  has: () => MainStorage.has(WC_KEY),
  get: (): ISessionsStorage | undefined => {
    const value = MainStorage.get(WC_KEY)
    return value ? value : undefined
  },
  save: (session: IWCSession) => {
    let storedSessions = MainStorage.get(WC_KEY)
    if (!storedSessions) {
      storedSessions = {}
    }
    storedSessions[session.key] = session
    return MainStorage.set(WC_KEY, storedSessions)
  },
  remove: (key: string) => {
    const sessions = MainStorage.get(WC_KEY)

    if (sessions) {
      delete sessions[key]
      MainStorage.set(WC_KEY, sessions)
    }
  },
})

const WalletConnectSessionStore = createStore()

export const hasWCSession = WalletConnectSessionStore.has
export const getWCSession = WalletConnectSessionStore.get
export const saveWCSession = WalletConnectSessionStore.save
export const deleteWCSession = WalletConnectSessionStore.remove
