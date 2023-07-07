import { Storage } from 'redux-persist'

import { MMKVStorage } from './MMKVStorage'

const storage = new MMKVStorage()

export const reduxStorage: Storage = {
  setItem: (key, value) => {
    storage.set(key, value)
    return Promise.resolve(true)
  },
  getItem: key => {
    const value = storage.get(key)
    return Promise.resolve(value)
  },
  removeItem: key => {
    storage.delete(key)
    return Promise.resolve()
  },
}
