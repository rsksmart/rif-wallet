import { StackScreenProps } from '@react-navigation/stack'
import { RIFWallet } from '../../lib/core'

export enum createKeysRouteNames {
  CreateKeys = 'CreateKeys',
  NewMasterKey = 'NewMasterKey',
  SecurityExplanation = 'SecurityExplanation',
  SecureYourWallet = 'SecureYourWallet',
  ConfirmNewMasterKey = 'ConfirmNewMasterKey',
  ImportMasterKey = 'ImportMasterKey',
  RevealMasterKey = 'RevealMasterKey',
}

export interface CreateKeysProps {
  generateMnemonic: () => string
  createFirstWallet: (mnemonic: string) => Promise<RIFWallet>
  isKeyboardVisible: boolean
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
