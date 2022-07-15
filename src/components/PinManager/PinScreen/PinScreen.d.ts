import React from 'react'

export type MessageComponentDefaultType = { message?: string }

export type DotsComponentDefaultType = {
  pin: Array<string>
}

export type PinScreenType = {
  MessageComponent?: React.FC<MessageComponentDefaultType>
  DotsComponent?: React.FC<DotsComponentDefaultType>
  KeypadComponent?: React.FC<any>
  onKeypadPress: (numberTouched: string) => any
  onKeypadDelete: () => any
  error?: string | null
  pin: Array<string>
}

export type PinContainerType = {
  pinLength: number
  onPinSubmit: (enteredPin: string) => Promise<unknown>
  PinScreenComponent?: React.FC<PinScreenType>
}

export type PinDotsRendererType = {
  index: number
  digit: string
  arr: Array<any>
}
