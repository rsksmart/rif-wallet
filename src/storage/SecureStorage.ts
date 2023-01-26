import {
  setGenericPassword,
  ACCESS_CONTROL,
  getGenericPassword,
  resetGenericPassword,
  AUTHENTICATION_TYPE,
  ACCESSIBLE,
  Result,
} from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info'
import { getKeysFromMMKV, saveKeysInMMKV } from './MainStorage'

const keyManagement = 'KEY_MANAGEMENT'

export const getKeys = async () => {
  try {
    const isEmulator = await DeviceInfo.isEmulator()

    if (!isEmulator) {
      const keys = await getGenericPassword({
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      })
      console.log('GETTING KMS', keys)
      if (!keys) {
        return null
      }
      return keys.password
    } else {
      const keys = getKeysFromMMKV()
      if (!keys) {
        return null
      }

      return keys
    }
  } catch (err) {
    throw new Error(err)
  }
}

export const saveKeys = async (keysValue: string) => {
  const isEmulator = await DeviceInfo.isEmulator()

  if (!isEmulator) {
    return setGenericPassword(keyManagement, keysValue, {
      accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
      accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
    })
  } else {
    saveKeysInMMKV(keysValue)
    return {
      service: 'MMKV',
      storage: 'MAIN_STORAGE',
    }
  }
}

export const deleteKeys = () => resetGenericPassword()
