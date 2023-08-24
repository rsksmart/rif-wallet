import { RnsProcessor } from 'lib/rns'

import { ProfileStatus } from 'navigation/profileNavigator/types'

export interface ProfileStore {
  alias: string
  phone: string
  email: string
  status: ProfileStatus
  infoBoxClosed: boolean
  duration: number | null
}

export interface RequestUsernameAction {
  rnsProcessor: {
    getStatus: RnsProcessor['getStatus']
    process: RnsProcessor['process']
    canReveal: RnsProcessor['canReveal']
  }
  alias: string
  duration: number
}

export interface PurchaseUsernameAction {
  rnsProcessor: {
    register: RnsProcessor['register']
  }
  domain: string
}
