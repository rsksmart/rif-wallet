import { IDomainRegistrationProcessIndex } from 'lib/rns'

import { MainStorage } from './MainStorage'

const key = 'RNS_PROCESSING_STATE'

export const hasRnsProcessor = () => MainStorage.has(key)

export const getRnsProcessor = () => {
  const jsonProfile = MainStorage.has(key) ? MainStorage.get(key) : '{}'
  const store: IDomainRegistrationProcessIndex = JSON.parse(jsonProfile || '{}')
  return store
}

export const deleteRnsProcessor = () => MainStorage.delete(key)

export const saveRnsProcessor = (
  aliasRegistration: IDomainRegistrationProcessIndex,
) => MainStorage.set(key, JSON.stringify(aliasRegistration))
