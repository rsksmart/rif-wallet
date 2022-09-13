import { useState, useEffect } from 'react'
import {
  getProfile,
  hasProfile,
  IProfileStore,
} from '../../storage/ProfileStore'

export const emptyProfile = {
  name: '',
  phone: '',
  email: '',
}

export function useProfile(initProfile?: IProfileStore) {
  const [profile, setProfile] = useState<IProfileStore | undefined>(initProfile)
  useEffect(() => {
    hasProfile().then(async r => {
      if (r) {
        await getProfile().then((storedProfile: IProfileStore) =>
          setProfile(storedProfile),
        )
      } else {
        setProfile(initProfile)
      }
    })
  }, [])

  function setCustomProfile(profile: IProfileStore) {
    setProfile(profile)
  }

  return [profile, setCustomProfile] as const
}
