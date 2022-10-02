import AsyncStorage from '@react-native-async-storage/async-storage'

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
  has: async () => {
    const value = await AsyncStorage.getItem(WC_KEY)
    return !!value
  },
  get: async () => {
    const value = await AsyncStorage.getItem(WC_KEY)
    return value && (JSON.parse(value) as ISessionsStorage)
  },
  save: async (session: IWCSession) => {
    const storedSessionsJson = await AsyncStorage.getItem(WC_KEY)
    const storedSessions =
      storedSessionsJson !== null
        ? (JSON.parse(storedSessionsJson) as ISessionsStorage)
        : {}

    const jsonValue = JSON.stringify({
      ...storedSessions,
      [session.key]: session,
    })

    return AsyncStorage.setItem(WC_KEY, jsonValue)
  },
  remove: async (key: string) => {
    const value = await AsyncStorage.getItem(WC_KEY)

    if (value) {
      const sessions = JSON.parse(value) as ISessionsStorage
      delete sessions[key]
      await AsyncStorage.setItem(WC_KEY, JSON.stringify({}))
    }
  },
})

const WalletConnectSessionStore = createStore()

export const hasWCSession = WalletConnectSessionStore.has
export const getWCSession = WalletConnectSessionStore.get
export const saveWCSession = WalletConnectSessionStore.save
export const deleteWCSession = WalletConnectSessionStore.remove
