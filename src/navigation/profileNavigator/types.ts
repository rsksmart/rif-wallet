import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum profileStackRouteNames {
  ProfileCreateScreen = 'ProfileCreateScreen',
  ShareProfileScreen = 'ShareProfileScreen',
  SearchDomain = 'SearchDomain',
  AliasBought = 'AliasBought',
  PurchaseDomain = 'PurchaseDomain',
}

export enum ProfileStatus {
  NONE,
  WAITING_FOR_USER_COMMIT,
  REQUESTING,
  READY_TO_PURCHASE,
  PURCHASING,
  USER,
  REQUESTING_ERROR,
}

export type ProfileStackParamsList = {
  [profileStackRouteNames.ProfileCreateScreen]: undefined
  [profileStackRouteNames.ShareProfileScreen]: undefined
  [profileStackRouteNames.SearchDomain]: undefined
  [profileStackRouteNames.AliasBought]: {
    alias: string
  }
  [profileStackRouteNames.PurchaseDomain]: undefined
}

export type ProfileStackScreenProps<T extends keyof ProfileStackParamsList> =
  CompositeScreenProps<
    StackScreenProps<ProfileStackParamsList, T>,
    RootTabsScreenProps<rootTabsRouteNames.Profile>
  >
