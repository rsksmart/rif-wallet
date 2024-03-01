import { createRef, useEffect } from 'react'
import {
  Alert,
  ImageStyle,
  TextInput,
  TextStyle,
  ViewStyle,
} from 'react-native'
import {
  addListener,
  enabled,
  enableSecureView,
  disableSecureView,
} from 'react-native-screenshot-prevent'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'

import { ErrorWithMessage } from '../types'

export const delay = (delayMs: number) => {
  return new Promise<true>(resolve =>
    setInterval(async () => {
      resolve(true)
    }, delayMs),
  )
}

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

export const usePreventScreenshot = (
  t: ReturnType<typeof useTranslation>['t'],
) => {
  const isFocused = useIsFocused()

  useEffect(() => {
    const subs = addListener(() => {
      Alert.alert(t('wallet_backup_title'), t('wallet_backup_message'), [
        { text: t('ok') },
      ])
    })

    return () => {
      subs.remove()
    }
  }, [t])

  useEffect(() => {
    if (isFocused) {
      enabled(true)
      enableSecureView()
      return
    }

    enabled(false)
    disableSecureView()
  }, [isFocused])
}

export * from './tokenValues'
export * from './wallet'
