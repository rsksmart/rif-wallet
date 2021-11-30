import { StackScreenProps } from '@react-navigation/stack'

export type StackParamList = {
  Bookmarks: undefined
  InjectedBrowser: { uri: string }
}

export type ScreenProps<T extends keyof StackParamList> = StackScreenProps<
  StackParamList,
  T
>
