import { ProfileStatus } from 'navigation/profileNavigator/types'

export interface IProfileStore {
  alias: string
  phone: string
  email: string
  status: ProfileStatus
}
