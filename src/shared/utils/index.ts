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

export const getFormattedTokenValue = (tokenValue: string) => {
  if (!tokenValue.includes('.')) {
    return tokenValue
  }

  const decimalsStr = tokenValue.split('.')[1]
  const decimals = decimalsStr.length

  if (decimals < 8) {
    return tokenValue
  }

  const restDecimals = decimalsStr.split('').slice(7, decimals)

  let moreThanZeroIndex = 0

  for (let i = 0; i < restDecimals.length; i++) {
    if (Number(restDecimals[i]) > 0) {
      moreThanZeroIndex = i
      break
    }
  }

  const hasOneMoreDigit = !!restDecimals[moreThanZeroIndex + 1]
  const lastAfterZero = restDecimals.slice(
    0,
    hasOneMoreDigit ? moreThanZeroIndex + 2 : moreThanZeroIndex + 1,
  )
  const ending = restDecimals[moreThanZeroIndex + 2] ? '...' : ''

  return '0.' + decimalsStr.slice(0, 7).concat(...lastAfterZero) + ending
}
