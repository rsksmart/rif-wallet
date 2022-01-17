import AsyncStorage from '@react-native-async-storage/async-storage'

const key = 'WALLET_CONNECT_SESSION'

export interface IWCSession {
  uri: string
  session: any
  walletAddress: string
}

export interface ISessionsStorage {
  [uri: string]: IWCSession
}

export const createStore = () => ({
  has: async () => {
    const value = await AsyncStorage.getItem(key)
    return value !== null
  },
  get: async () => {
    const value = await AsyncStorage.getItem(key)

    return value !== null ? (JSON.parse(value) as ISessionsStorage) : null
  },
  remove: async (uri: string) => {
    const value = await AsyncStorage.getItem(key)

    if (value === null) {
      return
    }

    const result = JSON.parse(value) as ISessionsStorage

    delete result[uri]

    return AsyncStorage.setItem(key, JSON.stringify(result))
  },
  save: async (session: IWCSession) => {
    const storedSessionsJson = await AsyncStorage.getItem(key)
    const storedSessions =
      storedSessionsJson !== null
        ? (JSON.parse(storedSessionsJson) as ISessionsStorage)
        : {}

    const jsonValue = JSON.stringify({
      ...storedSessions,
      [session.uri]: session,
    })

    return AsyncStorage.setItem(key, jsonValue)
  },
})

const WalletConnectSessionStore = createStore()

export const hasWCSession = WalletConnectSessionStore.has
export const getWCSession = WalletConnectSessionStore.get
export const saveWCSession = WalletConnectSessionStore.save
export const deleteWCSession = WalletConnectSessionStore.remove
