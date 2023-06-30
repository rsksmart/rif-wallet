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
    return value ? JSON.parse(value) : undefined
  },
  save: (session: IWCSession) => {
    const storedSessions = MainStorage.get(WC_KEY)

    if (!storedSessions) {
      MainStorage.set(WC_KEY, JSON.stringify({ [session.key]: session }))
    } else {
      const parsedSessions = JSON.parse(storedSessions)
      MainStorage.set(
        WC_KEY,
        JSON.stringify({
          ...parsedSessions,
          [session.key]: session,
        }),
      )
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
export const saveWCSession = session => {
  WalletConnectSessionStore.save(session)
  console.log('SESSION SAVED', getWCSession())
}
export const deleteWCSession = key => {
  WalletConnectSessionStore.remove(key)
  console.log('REMOVED SESSION', key, getWCSession)
}
