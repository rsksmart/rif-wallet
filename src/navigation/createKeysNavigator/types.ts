import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum createKeysRouteNames {
  CreateKeys = 'CreateKeys',
  NewMasterKey = 'NewMasterKey',
  SecurityInformation = 'SecurityInformation',
  SecureYourWallet = 'SecureYourWallet',
  ConfirmNewMasterKey = 'ConfirmNewMasterKey',
  ImportMasterKey = 'ImportMasterKey',
  RevealMasterKey = 'RevealMasterKey',
  PinScreen = 'PinScreen',
  RetryLogin = 'RetryLogin',
}

export type CreateKeysStackParamList = {
  [createKeysRouteNames.CreateKeys]: undefined
  [createKeysRouteNames.NewMasterKey]: undefined
  [createKeysRouteNames.SecurityInformation]: {
    moveTo:
      | createKeysRouteNames.ImportMasterKey
      | createKeysRouteNames.NewMasterKey
  }
  [createKeysRouteNames.SecureYourWallet]: undefined
  [createKeysRouteNames.ConfirmNewMasterKey]: { mnemonic: string }
  [createKeysRouteNames.ImportMasterKey]: undefined
  [createKeysRouteNames.RevealMasterKey]: undefined
  [createKeysRouteNames.PinScreen]: {
    isChangeRequested: boolean
    backScreen?: null
  }
  [createKeysRouteNames.RetryLogin]: undefined
}

export type CreateKeysScreenProps<T extends keyof CreateKeysStackParamList> =
  CompositeScreenProps<
    StackScreenProps<CreateKeysStackParamList, T>,
    RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
  >
