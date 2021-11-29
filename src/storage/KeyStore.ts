import { createStore } from './SecureStore'

const key = 'KEY_MANAGEMENT'
const KeyStore = createStore(key)

export const hasKeys = KeyStore.has
export const getKeys = KeyStore.get
export const saveKeys = KeyStore.save
export const deleteKeys = KeyStore.remove
