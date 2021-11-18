import RNSecureStorage, { ACCESSIBLE } from 'rn-secure-storage'

const key = 'PIN'

export const hasPin = () => RNSecureStorage.exists(key)
export const getPin = () => RNSecureStorage.get(key)
export const removePin = () => RNSecureStorage.remove(key)
export const savePin = (value: string) =>
  RNSecureStorage.set(key, value, {
    accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
  })

