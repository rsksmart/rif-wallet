import { StackScreenProps } from '@react-navigation/stack'
import { RIFWallet } from '../../lib/core'

export type CreateKeysProps = {
  generateMnemonic: () => string
  createFirstWallet: (mnemonic: string) => Promise<RIFWallet>
  isKeyboardVisible: boolean
}

export type StackParamList = {
  CreateKeys: undefined
  NewMasterKey: undefined
  SecurityExplanation: undefined
  SecureYourWallet: undefined
  ConfirmNewMasterKey: { mnemonic: string }
  ImportMasterKey: undefined
  RevealMasterKey: undefined
}

export type ScreenProps<T extends keyof StackParamList> = StackScreenProps<
  StackParamList,
  T
>
