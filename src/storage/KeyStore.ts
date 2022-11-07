import { Store } from './Store'

const key = 'KEY_MANAGEMENT'
const KeyStore = new Store(key)

export const hasKeys = KeyStore.has
export const getKeys = KeyStore.get
export const saveKeys = KeyStore.set
export const deleteKeys = KeyStore.deleteAll
