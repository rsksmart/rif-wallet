import { ProfileStatus } from 'navigation/profileNavigator/types'

export interface ProfileStore {
  alias: string
  phone: string
  email: string
  status: ProfileStatus
  infoBoxClosed: boolean
}
