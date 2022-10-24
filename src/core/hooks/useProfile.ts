import { useState, useEffect } from 'react'
import {
  deleteProfile,
  getProfile,
  hasProfile,
  IProfileStore,
  saveProfile,
} from '../../storage/ProfileStore'

export const emptyProfile = {
  alias: '',
  phone: '',
  email: '',
  accounts: [{ name: '' }],
}

export function useProfile(initProfile?: IProfileStore) {
  const [profile, setProfile] = useState<IProfileStore>(
    initProfile || emptyProfile,
  )

  const profileCreated = profile !== emptyProfile

  useEffect(() => {
    hasProfile().then(r => {
      if (r) {
        getProfile().then(setProfile)
      } else {
        setProfile(initProfile || emptyProfile)
      }
    })
  }, [])

  const storeProfile = async (newProfile: IProfileStore) => {
    setProfile(newProfile)
    await saveProfile(newProfile)
  }

  const eraseProfile = async () => {
    await deleteProfile()
    setProfile(emptyProfile)
  }

  return { profile, setProfile, storeProfile, eraseProfile, profileCreated }
}
