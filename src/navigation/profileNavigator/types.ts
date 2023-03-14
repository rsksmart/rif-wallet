import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum profileStackRouteNames {
  ProfileCreateScreen = 'ProfileCreateScreen',
  ShareProfileScreen = 'ShareProfileScreen',
  SearchDomain = 'SearchDomain',
  RequestDomain = 'RequestDomain',
  BuyDomain = 'BuyDomain',
  AliasBought = 'AliasBought',
  RegisterDomain = 'RegisterDomain',
  PurchaseDomain = 'PurchaseDomain',
}

export enum ProfileStatus {
  NONE,
  REQUESTING,
  READY_TO_PURCHASE,
  PURCHASING,
  USER,
  REQUESTING_ERROR,
  PURCHASING_ERROR,
}

export type ProfileStackParamsList = {
  [profileStackRouteNames.ProfileCreateScreen]: undefined
  [profileStackRouteNames.ShareProfileScreen]: undefined
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
  [profileStackRouteNames.PurchaseDomain]: undefined
}

export type ProfileStackScreenProps<T extends keyof ProfileStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Profile>
  >
