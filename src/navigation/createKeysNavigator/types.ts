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
  CreateKeys: undefined
  NewMasterKey: undefined
  SecurityExplanation: undefined
  SecureYourWallet: undefined
  ConfirmNewMasterKey: { mnemonic: string }
  ImportMasterKey: undefined
  RevealMasterKey: undefined
}

export type CreateKeysScreenProps<T extends keyof CreateKeysStackParamList> =
  StackScreenProps<CreateKeysStackParamList, T>
