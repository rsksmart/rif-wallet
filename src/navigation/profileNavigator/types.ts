import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'
import { ProfileStore } from 'store/slices/profileSlice/types'
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

export enum ProfileStatus {
  NONE,
  REQUESTING,
  READY_TO_PURCHASE,
  PURCHASING,
  USER,
  ERROR,
}

export type ProfileStackParamsList = {
  [profileStackRouteNames.ProfileCreateScreen]:
    | {
        editProfile: boolean
        profile?: ProfileStore
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
  }
  [profileStackRouteNames.AliasBought]: {
    alias: string
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
