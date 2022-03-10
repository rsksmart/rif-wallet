import { StackScreenProps } from '@react-navigation/stack'
import { RIFWallet } from '../../lib/core'

export type CreateKeysProps = {
  generateMnemonic: () => string
  createFirstWallet: (mnemonic: string) => Promise<RIFWallet>
}

export type StackParamList = {
  CreateKeys: undefined
  NewMasterKey: undefined
  ConfirmNewMasterKey: { mnemonic: string }
  ImportMasterKey: undefined
  KeysCreated: {
    address: string
  }
  RevealMasterKey: undefined
}

export type ScreenProps<T extends keyof StackParamList> = StackScreenProps<
  StackParamList,
  T
>
