import { createRef } from 'react'
import { ImageStyle, TextInput, TextStyle, ViewStyle } from 'react-native'

import { ErrorWithMessage } from '../types'

export const errorHandler = (error: unknown) => {
  if (typeof error === 'object' && Object.hasOwn(error as object, 'message')) {
    const err = error as ErrorWithMessage
    return err.message
  } else {
    return 'Unknown error occurred!'
  }
}

export const handleInputRefCreation = () => {
  const firstRef = createRef<TextInput>()
  const secondRef = createRef<TextInput>()
  const thirdRef = createRef<TextInput>()

  return {
    firstRef,
    secondRef,
    thirdRef,
  }
}

export const castStyle = {
  text: (style: TextStyle) => style,
  view: (style: ViewStyle) => style,
  image: (style: ImageStyle) => style,
}

export const getRandomNumber = (max: number, min: number) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
