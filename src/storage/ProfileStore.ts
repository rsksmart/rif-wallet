import { Store } from './Store'

const key = 'PROFILE'
const ProfileStore = new Store(key)
export type IProfileStore = {
  alias: string
  phone: string
  email: string
}
export const hasProfile = ProfileStore.has

export const getProfile = async () => {
  const jsonProfile = (await ProfileStore.has())
    ? await ProfileStore.get()
    : '{}'
  const store: IProfileStore = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteProfile = ProfileStore.deleteAll

export const saveProfile = async (profile: IProfileStore) =>
  ProfileStore.set(JSON.stringify(profile))
