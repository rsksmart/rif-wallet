import { createStore } from './NormalStore'

const key = 'ALIAS_REGISTRATION'
const ProfileRegistrationStore = createStore(key)
export type IProfileRegistrationStore = {
  commitToRegisterHash: string
  commitToRegisterSecret: string
}
export const hasAliasRegistration = ProfileRegistrationStore.has

export const getAliasRegistration = async () => {
  const jsonProfile = (await ProfileRegistrationStore.has())
    ? await ProfileRegistrationStore.get()
    : '{}'
  const store: IProfileRegistrationStore = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteAliasRegistration = ProfileRegistrationStore.remove

export const saveAliasRegistration = async (
  aliasRegistration: IProfileRegistrationStore,
) => ProfileRegistrationStore.save(JSON.stringify(aliasRegistration))
