import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

export enum StorageKeys {
  MNEMONIC = 'mnemonic', // deprecated
  KMS = 'KEY_MANAGEMENT',
}

export const getStorage = (key: StorageKeys): Promise<string | null> =>
  RNSecureStorage.get(key)

export const setStorage = (key: StorageKeys, data: string) =>
  RNSecureStorage.set(key, data, { accessible: ACCESSIBLE.WHEN_UNLOCKED })

export const removeStorage = (key: StorageKeys) => RNSecureStorage.remove(key)
