import { createStore } from './SecureStore'

const key = 'KeyVerificationReminder'
const KeyVerificationReminderStore = createStore(key)

export const hasKeyVerificationReminder = KeyVerificationReminderStore.has
export const getKeyVerificationReminder = async () => {
  const result = await KeyVerificationReminderStore.get()
  console.log({ result })
  return result === 'true'
}
export const deleteKeyVerificationReminder = KeyVerificationReminderStore.remove
export const saveKeyVerificationReminder = (value: boolean) =>
  KeyVerificationReminderStore.save(value.toString())
