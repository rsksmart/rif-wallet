import { createRef } from 'react'
import { TextInput } from 'react-native'

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
