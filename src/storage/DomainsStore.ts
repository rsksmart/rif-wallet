import { MainStorage } from './MainStorage'

const key = 'DOMAINS'

interface DomainStoreType {
  [owner: string]: string[]
}

export const getDomains = (owner: string) => {
  const store: DomainStoreType = JSON.parse(
    MainStorage.has(key) ? MainStorage.get(key)! : '{}',
  )
  return store[owner] || []
}

export const addDomain = async (owner: string, domain: string) => {
  const store: DomainStoreType = JSON.parse(
    MainStorage.has(key) ? MainStorage.get(key) : '{}',
  )
  if (!store[owner]) {
    store[owner] = []
  }
  store[owner].push(domain)
  MainStorage.set(key, store)
}

export const deleteDomains = () => MainStorage.delete(key)
