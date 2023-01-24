import {
  setGenericPassword,
  ACCESS_CONTROL,
  getGenericPassword,
  getSupportedBiometryType,
  resetGenericPassword,
  AUTHENTICATION_TYPE,
  ACCESSIBLE,
} from 'react-native-keychain'

const keyManagement = 'KEY_MANAGEMENT'

export const getKeys = async () => {
  try {
    const supportedType = await getSupportedBiometryType()

    console.log('SUPPORTED TYPE', supportedType)

    const keys = await getGenericPassword({
      accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
      authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
      accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
    })
    if (!keys) {
      return null
    }
    console.log('GETTING KMS', keys)
    return keys
  } catch (err) {
    throw new Error(err)
  }
}

export const saveKeys = async (keysValue: string) =>
  setGenericPassword(keyManagement, keysValue, {
    accessible: ACCESSIBLE.WHEN_PASSCODE_SET_THIS_DEVICE_ONLY,
    authenticationType: AUTHENTICATION_TYPE.DEVICE_PASSCODE_OR_BIOMETRICS,
    accessControl: ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE,
  })

export const deleteKeys = () => resetGenericPassword()
