import { createStore } from './SecureStore'

const key = 'KeyVerificationReminder'
const KeyVerificationReminderStore = createStore(key)

export const hasKeyVerificationReminder = KeyVerificationReminderStore.has
export const getKeyVerificationReminder = () =>
  Boolean(KeyVerificationReminderStore.get())
export const saveKeyVerificationReminder = (value: boolean) =>
  KeyVerificationReminderStore.save(value.toString())
