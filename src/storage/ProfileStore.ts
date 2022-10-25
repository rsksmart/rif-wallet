import { createStore } from './SecureStore'

const key = 'PROFILE'
const ProfileStore = createStore(key)

export type IAccount = {
  name: string
}

export type IProfileStore = {
  alias: string
  phone: string
  email: string
  accounts: IAccount[]
}

export const hasProfile = ProfileStore.has

export const getProfile = async () => {
  const jsonProfile = (await ProfileStore.has())
    ? await ProfileStore.get()
    : '{}'
  const store: IProfileStore = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteProfile = ProfileStore.remove

export const saveProfile = async (profile: IProfileStore) =>
  ProfileStore.save(JSON.stringify(profile))
