import { useState, useEffect } from 'react'
import {
  deleteProfile,
  getProfile,
  hasProfile,
  IProfileStore,
  saveProfile,
} from '../../storage/MainStorage'

export const emptyProfile = {
  alias: '',
  phone: '',
  email: '',
  accounts: [],
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
  }, [initProfile])

  const storeProfile = async (newProfile: IProfileStore) => {
    setProfile(newProfile)
    saveProfile(newProfile)
  }

  const eraseProfile = async () => {
    deleteProfile()
    setProfile(emptyProfile)
  }

  return { profile, setProfile, storeProfile, eraseProfile, profileCreated }
}
