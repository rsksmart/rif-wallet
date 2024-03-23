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

// this needs to be here because of the failing tests
enum TokenSymbol {
  TRBTC = 'TRBTC',
  RBTC = 'RBTC',
}

export const rbtcMap = new Map([
  [TokenSymbol.TRBTC, true],
  [TokenSymbol.RBTC, true],
  [undefined, false],
])

interface FormatNumberOptions {
  decimalPlaces?: number
  useThousandSeparator?: boolean
  isCurrency?: boolean
  sign?: string
}

/**
 * Formats a number or a numeric string with the given options.
 * @param num The number or string to format.
 * @param options The formatting options to use.
 * @returns The formatted number as a string.
 */
const formatNumber = (
  num: number | string,
  options: FormatNumberOptions = {},
): string => {
  // Attempt to parse if num is a string
  if (typeof num === 'string') {
    const parsedNum = parseFloat(num)
    if (isNaN(parsedNum)) {
      return num
    }
    num = parsedNum
  }

  // Destructure with default values
  const {
    decimalPlaces = 8,
    useThousandSeparator = true,
    isCurrency = false,
    sign = '',
  } = options

  // Calculate the minimum value that can be displayed given the number of decimal places
  const minValue = 1 / Math.pow(10, decimalPlaces)

  // Check for small positive amounts less than the minimum value
  if (num > 0 && num < minValue) {
    return `<${sign}0.${'0'.repeat(decimalPlaces - 1)}1`
  }

  // Format the number with fixed decimal places
  let result = num.toFixed(isCurrency ? 2 : decimalPlaces)

  // For non-currency numbers, remove unnecessary trailing zeros
  if (!isCurrency) {
    result = result.replace(/(\.\d*?[1-9])0+$|\.0*$/, '$1')
  }

  // Add thousand separators if enabled
  if (useThousandSeparator) {
    const parts = result.split('.')
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    result = parts.join('.')
  }

  // Check if the number is negative; if so, format accordingly
  if (num < 0) {
    return `-${sign}${result.substring(1)}`
  }

  return `${sign}${result}`
}

/**
 * Formats a number or a numeric string as a USD value with a dollar sign.
 * Should be used only at the end when showing values.
 * @param value The number or string to format.
 * @param sign The currency sign to use.
 * @returns The formatted USD value with a dollar sign as a string.
 */
export const formatFiatValue = (value: number | string, sign = '$'): string =>
  formatNumber(value, {
    decimalPlaces: 2,
    useThousandSeparator: true,
    isCurrency: true,
    sign,
  })

/**
 * Formats a number or a numeric string as a token value.
 * Should be used only at the end when showing values.
 * @param value The number or string to format.
 * @returns The formatted token value as a string.
 */
export const formatTokenValue = (
  value: number | string,
  precision = 8,
): string =>
  formatNumber(value, {
    decimalPlaces: precision,
    useThousandSeparator: true,
    isCurrency: false,
  })

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
