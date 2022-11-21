import { FC } from 'react'
import { ViewProps, TextProps } from 'react-native'
import { KeypadComponentProps } from 'src/components/keyPad'

export interface MessageComponentDefaultType {
  message?: string
  TextProps?: TextProps
  ViewProps?: ViewProps
}

export interface DotsComponentDefaultType {
  pin: Array<string>
}

export interface PinScreenType {
  MessageComponent?: FC<MessageComponentDefaultType>
  DotsComponent?: FC<DotsComponentDefaultType>
  KeypadComponent?: FC<KeypadComponentProps>
  onKeypadPress: (numberTouched: string) => void
  onKeypadDelete: () => void
  error?: string | null
  pin: Array<string>
  resetEnabled: boolean
  resetKeysAndPin: () => void
}

export interface PinContainerType {
  pinLength: number
  onPinSubmit: (enteredPin: string) => Promise<void>
  resetKeysAndPin?: () => void
  resetEnabled?: boolean
  PinScreenComponent?: FC<PinScreenType>
}

export interface PinDotsRendererType {
  index: number
  digit: string
  arr: Array<unknown>
}
