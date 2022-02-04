import { createStore } from './NormalStore'

const key = 'DOMAINS'
const DomainStore = createStore(key)

type DomainStoreType = {
  [owner: string]: string[]
}

export const getDomains = async (owner: string) => {
  const store: DomainStoreType = JSON.parse(
    (await DomainStore.has()) ? await DomainStore.get()! : '{}',
  )
  return store[owner] || []
}

export const addDomain = async (owner: string, domain: string) => {
  const store: DomainStoreType = JSON.parse(
    (await DomainStore.has()) ? await DomainStore.get()! : '{}',
  )
  if (!store[owner]) {
    store[owner] = []
  }
  store[owner].push(domain)
  DomainStore.save(JSON.stringify(store))
}
