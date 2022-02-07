
import { AsyncStorage } from 'react-native'
export const createStore = (key: string) => ({
  has: async () => {
    const value = await AsyncStorage.getItem(key)
    return value !== null
  },
  get: async () => {
    const value = await AsyncStorage.getItem(key)

    return value !== null ? JSON.parse(value) : null
  },
  remove: () => AsyncStorage.removeItem(key),
  save: (value: any) => {
    const jsonValue = JSON.stringify(value)

    return AsyncStorage.setItem(key, jsonValue)
  },
})
