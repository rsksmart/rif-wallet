import { Store } from './Store'

const key = 'PIN'
const PINStore = new Store(key)

export const hasPin = PINStore.has
export const getPin = PINStore.get
export const deletePin = PINStore.deleteAll
export const savePin = PINStore.set
