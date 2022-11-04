import { createStore } from './NormalStore'

const key = 'KeyVerificationReminder'
const KeyVerificationReminderStore = createStore(key)

export const hasKeyVerificationReminder = KeyVerificationReminderStore.has
export const getKeyVerificationReminder = async () => {
  return (await KeyVerificationReminderStore.get()) === 'true'
}
export const saveKeyVerificationReminder = (value: boolean) =>
  KeyVerificationReminderStore.save(value.toString())
