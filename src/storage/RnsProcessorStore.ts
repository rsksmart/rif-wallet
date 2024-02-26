import { IDomainRegistrationProcessIndex } from 'lib/rns'

import { MainStorage } from './MainStorage'

const key = 'RNS_PROCESSING_STATE'

export const hasRnsProcessIndex = () => MainStorage.has(key)

export const getRnsProcessIndex = () => {
  const jsonProfile = MainStorage.has(key) ? MainStorage.get(key) : '{}'
  const store: IDomainRegistrationProcessIndex = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteRnsProcessIndex = () => MainStorage.delete(key)

export const saveRnsProcessIndex = (
  aliasRegistration: IDomainRegistrationProcessIndex,
) => MainStorage.set(key, JSON.stringify(aliasRegistration))
