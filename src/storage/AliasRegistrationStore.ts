import { MainStorage } from './MainStorage'

const key = 'ALIAS_REGISTRATION'
export type IProfileRegistrationStore = {
  alias: string
  duration: number
  commitToRegisterHash: string
  commitToRegisterSecret: string
}
export const hasAliasRegistration = () => MainStorage.has(key)

export const getAliasRegistration = () => {
  const jsonProfile = MainStorage.has(key) ? MainStorage.get(key) : '{}'
  const store: IProfileRegistrationStore = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteAliasRegistration = () => MainStorage.delete(key)

export const saveAliasRegistration = (
  aliasRegistration: IProfileRegistrationStore,
) => MainStorage.set(key, JSON.stringify(aliasRegistration))
