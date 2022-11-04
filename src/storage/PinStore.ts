import { createStore } from './NormalStore'

const key = 'PIN'
const PINStore = createStore(key)

export const hasPin = PINStore.has
export const getPin = PINStore.get
export const deletePin = PINStore.remove
export const savePin = PINStore.save
