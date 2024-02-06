import { ProfileStatus } from 'navigation/profileNavigator/types'
import { GetRnsProcessor } from 'shared/wallet'

export interface ProfileStore {
  alias: string
  phone: string
  email: string
  status: ProfileStatus
  infoBoxClosed: boolean
  duration: number | null
}

export interface PurchaseUsername {
  getRnsProcessor: GetRnsProcessor
  domain: string
}

export interface RequestUsername {
  getRnsProcessor: GetRnsProcessor
  alias: string
  duration: number
}

export interface DeleteRnsProcess {
  getRnsProcessor: GetRnsProcessor
  domain: string
}

export interface CommitmentRnsProcess {
  getRnsProcessor: GetRnsProcessor
  alias: string
}
