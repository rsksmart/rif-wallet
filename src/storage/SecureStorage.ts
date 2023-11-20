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

import { WalletState } from 'lib/eoaWallet'

import { getKeysFromMMKV, saveKeysInMMKV } from './MainStorage'

const keyManagement = 'KEY_MANAGEMENT'

export const getKeys = async (): Promise<WalletState | null> => {
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
            : ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      })
      if (!keys) {
        return null
      }
      return JSON.parse(keys.password)
    } else {
      const keys = getKeysFromMMKV()
      if (!keys) {
        return null
      }

      return JSON.parse(keys)
    }
  } catch (err) {
    console.log('ERROR GETTING KEYS', err.message)
    throw new Error(err)
  }
}

export const saveKeys = async (privateKey: string, mnemonic?: string) => {
  try {
    const keysObject = JSON.stringify({ privateKey, mnemonic })

    const isEmulator = await DeviceInfo.isEmulator()

    if (!isEmulator) {
      const supportedBiometry = await getSupportedBiometryType()
      const biometry =
        Platform.OS === 'ios'
          ? await canImplyAuthentication({
              accessControl: ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            })
          : Boolean(supportedBiometry)

      return setGenericPassword(keyManagement, keysObject, {
        accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
        authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
        accessControl:
          !supportedBiometry || !biometry
            ? ACCESS_CONTROL.DEVICE_PASSCODE
            : ACCESS_CONTROL.BIOMETRY_CURRENT_SET_OR_DEVICE_PASSCODE,
      })
    } else {
      saveKeysInMMKV(keysObject)
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
