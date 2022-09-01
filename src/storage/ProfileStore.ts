import { createStore } from './SecureStore'

const key = 'PROFILE'
const ProfileStore = createStore(key)

export const hasProfile = ProfileStore.has
export const getProfile = ProfileStore.get
export const deleteProfile = ProfileStore.remove
export const saveProfile = ProfileStore.save
