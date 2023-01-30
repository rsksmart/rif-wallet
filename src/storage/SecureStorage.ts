import {
  setGenericPassword,
  ACCESS_CONTROL,
  getGenericPassword,
  resetGenericPassword,
  AUTHENTICATION_TYPE,
  ACCESSIBLE,
  Result,
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
      console.log('SUPPORTED BIOMETRY', supportedBiometry)

      const keys = await getGenericPassword({
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl: !supportedBiometry
          ? ACCESS_CONTROL.DEVICE_PASSCODE
          : ACCESS_CONTROL.BIOMETRY_ANY,
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
      const biometry = await canImplyAuthentication({
        accessControl: ACCESS_CONTROL.BIOMETRY_ANY,
      })
      console.log('CAN IMPLY BIOMETRY', biometry)
      console.log('SUPPORTED BIOMETRY', supportedBiometry)

      return setGenericPassword(keyManagement, keysValue, {
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl: !supportedBiometry
          ? ACCESS_CONTROL.DEVICE_PASSCODE
          : !biometry
          ? ACCESS_CONTROL.DEVICE_PASSCODE
          : ACCESS_CONTROL.BIOMETRY_ANY,
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
