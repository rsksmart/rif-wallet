import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

export const createStore = (key: string) => ({
  has: () => RNSecureStorage.exists(key),
  get: () => RNSecureStorage.get(key),
  remove: () => RNSecureStorage.remove(key),
  save: (value: string) =>
    RNSecureStorage.set(key, value, {
      accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    }),
})
