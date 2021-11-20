import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

export enum STORAGE_KEYS {
  pin = 'PIN',
  key_management = 'KEY_MANAGEMENT',
}

export const exists = (key: string) => RNSecureStorage.exists(key)
export const get = (key: string) => RNSecureStorage.get(key)
export const set = (key: string, value: string) =>
  RNSecureStorage.set(key, value, {
    accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  })
export const remove = (key: string) => RNSecureStorage.remove(key)
