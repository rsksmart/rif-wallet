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
  const [profile, setProfile] = useState<IProfileStore | undefined>(initProfile)
  useEffect(() => {
    hasProfile().then(async r => {
      if (r) {
        await getProfile().then(setProfile)
      } else {
        setProfile(initProfile)
      }
    })
  }, [])
  const storeProfile = async () => {
    await saveProfile({
      alias: profile?.alias ?? '',
      phone: profile?.phone ?? '',
      email: profile?.email ?? '',
    })
  }
  const eraseProfile = async () => {
    await deleteProfile()
    setProfile(undefined)
  }

  return { profile, setProfile, storeProfile, eraseProfile }
}
