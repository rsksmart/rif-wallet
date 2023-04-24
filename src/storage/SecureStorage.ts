import { Platform } from 'react-native'
import {
  setGenericPassword,
  ACCESS_CONTROL,
  getGenericPassword,
  resetGenericPassword,
  AUTHENTICATION_TYPE,
  ACCESSIBLE,
  getSupportedBiometryType,
  canImplyAuthentication,
} from 'react-native-keychain'
import DeviceInfo from 'react-native-device-info'

import { getKeysFromMMKV, saveKeysInMMKV } from './MainStorage'

const keyManagement = 'KEY_MANAGEMENT'

export const getKeys = async () => {
  try {
    const isEmulator = await DeviceInfo.isEmulator()

    if (!isEmulator) {
      const supportedBiometry = await getSupportedBiometryType()
      const biometry = await canImplyAuthentication({
        accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      })

      const keys = await getGenericPassword({
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl:
          !supportedBiometry || !biometry
            ? ACCESS_CONTROL.DEVICE_PASSCODE
            : ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      })
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
    console.log('ERROR GETTING KEYS', err.message)
    throw new Error(err)
  }
}

export const saveKeys = async (keysValue: string) => {
  try {
    const isEmulator = await DeviceInfo.isEmulator()

    if (!isEmulator) {
      const supportedBiometry = await getSupportedBiometryType()
      const biometry =
        Platform.OS === 'ios'
          ? await canImplyAuthentication({
              accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            })
          : Boolean(supportedBiometry)

      return setGenericPassword(keyManagement, keysValue, {
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl:
          !supportedBiometry || !biometry
            ? ACCESS_CONTROL.DEVICE_PASSCODE
            : ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
      })
    } else {
      saveKeysInMMKV(keysValue)
      return {
        service: 'MMKV',
        storage: 'MAIN_STORAGE',
      }
    }
  } catch (err) {
    console.log('ERROR SAVING KEYS', err.message)
    throw new Error(err)
  }
}

export const deleteKeys = () => resetGenericPassword()
