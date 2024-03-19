import { Storage } from 'redux-persist'

import { MMKVStorage } from './MMKVStorage'

const storage = new MMKVStorage()

export const reduxStorage: (chainId: number) => Storage = (
  chainId: number,
) => ({
  setItem: (key, value) => {
    const keyToUse = `${key}_${chainId}`
    if (chainId === 31) {
      storage.set(key, value)
    }
    storage.set(keyToUse, value)
    return Promise.resolve(true)
  },
  getItem: key => {
    let keyToUse = `${key}_${chainId}`
    if (chainId === 31) {
      keyToUse = key
    }
    const value = storage.get(keyToUse)
    return Promise.resolve(value)
  },
  removeItem: key => {
    const keyToUse = `${key}_${chainId}`
    if (chainId === 31) {
      storage.delete(key)
    }
    storage.delete(keyToUse)
    return Promise.resolve()
  },
})

// Incremental rollout - uncomment this and remove code above after 1 month (due date: 12 Oct 2023)
/*
export const reduxStorage: (chainId: number) => Storage = (
  chainId: number,
) => ({
  setItem: (key, value) => {
    storage.set(`${key}_${chainId}`, value)
    return Promise.resolve(true)
  },
  getItem: key => {
    const value = storage.get(`${key}_${chainId}`)
    return Promise.resolve(value)
  },
  removeItem: key => {
    storage.delete(`${key}_${chainId}`)
    return Promise.resolve()
  },
})*/

export const removeBalances = () => storage.delete('balances')
export const removeAccounts = () => storage.delete('accounts')

export const resetReduxStorage = () => storage.deleteAll()
