import { Store } from './Store'

const key = 'KeyVerificationReminder'
const KeyVerificationReminderStore = new Store(key)

export const hasKeyVerificationReminder = KeyVerificationReminderStore.has
export const getKeyVerificationReminder = async () => {
  return (await KeyVerificationReminderStore.get()) === 'true'
}
export const saveKeyVerificationReminder = (value: boolean) =>
  KeyVerificationReminderStore.set(value.toString())
