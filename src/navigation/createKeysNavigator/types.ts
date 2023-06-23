import { CompositeScreenProps } from '@react-navigation/native'
import { StackScreenProps } from '@react-navigation/stack'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'

export enum createKeysRouteNames {
  CreateKeys = 'CreateKeys',
  NewMasterKey = 'NewMasterKey',
  SecurityExplanation = 'SecurityExplanation',
  SecureYourWallet = 'SecureYourWallet',
  ConfirmNewMasterKey = 'ConfirmNewMasterKey',
  ImportMasterKey = 'ImportMasterKey',
  RevealMasterKey = 'RevealMasterKey',
  CreatePIN = 'CreatePIN',
}

export type CreateKeysStackParamList = {
  [createKeysRouteNames.CreateKeys]: undefined
  [createKeysRouteNames.NewMasterKey]: undefined
  [createKeysRouteNames.SecurityExplanation]: undefined
  [createKeysRouteNames.SecureYourWallet]: undefined
  [createKeysRouteNames.ConfirmNewMasterKey]: { mnemonic: string }
  [createKeysRouteNames.ImportMasterKey]: undefined
  [createKeysRouteNames.RevealMasterKey]: undefined
  [createKeysRouteNames.CreatePIN]: {
    isChangeRequested: true
    backScreen?: null
  }
}

export type CreateKeysScreenProps<T extends keyof CreateKeysStackParamList> =
  CompositeScreenProps<
    StackScreenProps<CreateKeysStackParamList, T>,
    RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
  >
