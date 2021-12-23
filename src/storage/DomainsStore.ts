import { createStore } from './SecureStore'

const key = 'DOMAINS'
const KeyStore = createStore(key)

export const hasDomains = KeyStore.has
export const getDomains = KeyStore.get
export const saveDomains = KeyStore.save
export const deleteDomains = KeyStore.remove
