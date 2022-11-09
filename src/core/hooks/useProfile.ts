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
}

export function useProfile(initProfile?: IProfileStore) {
  const [profile, setProfile] = useState<IProfileStore>(
    initProfile || emptyProfile,
  )

  const profileCreated = profile !== emptyProfile

  useEffect(() => {
    if (hasProfile()) {
      setProfile(getProfile())
    } else {
      setProfile(initProfile || emptyProfile)
    }
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
