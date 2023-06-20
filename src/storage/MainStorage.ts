import { Contact } from 'shared/types'
import { Wallets, WalletsIsDeployed } from 'src/Context'
import { SetKeysAction } from 'src/redux/slices/settingsSlice/types'

import { MMKVStorage } from './MMKVStorage'

export const MainStorage = new MMKVStorage()

const pin = 'PIN'
const keyVerificationReminder = 'KEY_VERIFICATION_REMINDER'
const keyManagement = 'KEY_MANAGEMNT'
const contacts = 'CONTACTS'
const signup = 'SIGN_UP'
const closeStart = 'CLOSE_GETTING_STARTED'
const magicWallet = 'MAGIC_WALLET'

//emulator keys functions
export const getKeysFromMMKV = (): string | undefined =>
  MainStorage.get(keyManagement)
export const saveKeysInMMKV = (value: string) =>
  MainStorage.set(keyManagement, value)

// pin functions
export const hasPin = () => MainStorage.has(pin)
export const getPin = (): string => MainStorage.get(pin)
export const deletePin = () => MainStorage.delete(pin)
export const savePin = (pinValue: string) => MainStorage.set(pin, pinValue)

// keyVerificationReminder functions
export const hasKeyVerificationReminder = () =>
  MainStorage.has(keyVerificationReminder)
export const getKeyVerificationReminder = () => {
  return MainStorage.get(keyVerificationReminder) === 'true'
}
export const saveKeyVerificationReminder = (value: boolean) =>
  MainStorage.set(keyVerificationReminder, value.toString())

// contacts functions
export const hasContacts = () => MainStorage.has(contacts)
export const getContacts = () => MainStorage.get(contacts)
// TODO define type for contacts
export const saveContacts = (value: Record<string, Contact>) =>
  MainStorage.set(contacts, value)
export const deleteContacts = () => MainStorage.delete(contacts)

// signup function
export const hasSignUP = () => MainStorage.has(signup)
export const getSignUP = () => MainStorage.get(signup)
export const saveSignUp = (value: { signup: boolean }) =>
  MainStorage.set(signup, value)
export const deleteSignUp = () => MainStorage.delete(signup)

// close get started function
export const hasIsGettingStartedClosed = () => MainStorage.has(closeStart)
export const getIsGettingStartedClosed = () => MainStorage.get(closeStart)
export const saveIsGettingStartedClosed = (value: { close: boolean }) =>
  MainStorage.set(closeStart, value)
export const deleteIsGettingStartedClosed = () => MainStorage.delete(closeStart)

// general function
export const resetMainStorage = () => MainStorage.deleteAll()

// magic wallet functions
export const hasMagicWallet = () => MainStorage.has(magicWallet)
export const getMagicWallet = (): SetKeysAction | undefined => {
  const wallet = MainStorage.get(magicWallet)

  if (wallet) {
    return JSON.parse(wallet)
  }

  return undefined
}

export const saveMagicWallet = (walletsObject: SetKeysAction) =>
  MainStorage.set(magicWallet, JSON.stringify(walletsObject))
export const deleteMagicWallet = () => MainStorage.delete(magicWallet)
