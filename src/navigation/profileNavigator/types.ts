import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ContractTransaction } from 'ethers'
import { IProfileStore } from 'store/slices/profileSlice/types'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum profileStackRouteNames {
  ProfileCreateScreen = 'ProfileCreateScreen',
  ProfileDetailsScreen = 'ProfileDetailsScreen',
  SearchDomain = 'SearchDomain',
  RequestDomain = 'RequestDomain',
  BuyDomain = 'BuyDomain',
  AliasBought = 'AliasBought',
  RegisterDomain = 'RegisterDomain',
}

export type ProfileStackParamsList = {
  [profileStackRouteNames.ProfileCreateScreen]:
    | {
        editProfile: boolean
        profile?: IProfileStore
      }
    | undefined
  [profileStackRouteNames.ProfileDetailsScreen]: undefined
  [profileStackRouteNames.SearchDomain]: undefined
  [profileStackRouteNames.RequestDomain]: {
    alias: string
    duration: number
  }
  [profileStackRouteNames.BuyDomain]: {
    alias: string
    domainSecret: string
    duration: number
  }
  [profileStackRouteNames.AliasBought]: {
    alias: string
    tx: ContractTransaction
  }
  [profileStackRouteNames.RegisterDomain]: {
    selectedDomain: string
    years: number
  }
}

export type ProfileStackScreenProps<T extends keyof ProfileStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Profile>
  >
