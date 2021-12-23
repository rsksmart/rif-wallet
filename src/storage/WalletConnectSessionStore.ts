import { createStore } from './NormalStore'

const key = 'WALLET_CONNECT_SESSION'
const WalletConnectSessionStore = createStore(key)

export const hasWCSession = WalletConnectSessionStore.has
export const getWCSession = WalletConnectSessionStore.get
export const saveWCSession = WalletConnectSessionStore.save
export const deleteWCSession = WalletConnectSessionStore.remove
