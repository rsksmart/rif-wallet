import { MainStorage } from './MainStorage'

const WC_KEY = 'WALLET_CONNECT_SESSION'

export interface IWCSession {
  key: string
  uri: string
  session: any
  walletAddress: string
}

export interface ISessionsStorage {
  [key: string]: IWCSession
}

export const createStore = () => ({
  has: () => {
    const value = MainStorage.get(WC_KEY)
    return !!value
  },
  get: (): ISessionsStorage | undefined => {
    const value = MainStorage.get(WC_KEY)
    return value ? JSON.parse(value) : undefined
  },
  save: (session: IWCSession) => {
    const storedSessions = MainStorage.get(WC_KEY)

    if (storedSessions && typeof storedSessions === 'object') {
      return MainStorage.set(WC_KEY, {
        ...storedSessions,
        [session.key]: session,
      })
    }
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
