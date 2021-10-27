import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

const key = 'KEY_MANAGEMENT'

export const hasKeys = () => RNSecureStorage.exists(key)
export const getKeys = () => RNSecureStorage.get(key)
export const saveKeys = (value: string) => RNSecureStorage.set(key, value, { accessible: ACCESSIBLE.WHEN_UNLOCKED })
export const deleteKeys = () => RNSecureStorage.remove(key)
