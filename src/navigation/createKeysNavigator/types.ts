import { StackScreenProps } from '@react-navigation/stack'

export enum createKeysRouteNames {
  CreateKeys = 'CreateKeys',
  NewMasterKey = 'NewMasterKey',
  SecurityExplanation = 'SecurityExplanation',
  SecureYourWallet = 'SecureYourWallet',
  ConfirmNewMasterKey = 'ConfirmNewMasterKey',
  ImportMasterKey = 'ImportMasterKey',
  RevealMasterKey = 'RevealMasterKey',
}

export type CreateKeysStackParamList = {
  [createKeysRouteNames.CreateKeys]: undefined
  [createKeysRouteNames.NewMasterKey]: undefined
  [createKeysRouteNames.SecurityExplanation]: undefined
  [createKeysRouteNames.SecureYourWallet]: undefined
  [createKeysRouteNames.ConfirmNewMasterKey]: { mnemonic: string }
  [createKeysRouteNames.ImportMasterKey]: undefined
  [createKeysRouteNames.RevealMasterKey]: undefined
}

export type CreateKeysScreenProps<T extends keyof CreateKeysStackParamList> =
  StackScreenProps<CreateKeysStackParamList, T>
