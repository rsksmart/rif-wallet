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
import Config from 'react-native-config'
import { providers } from 'ethers'
import { RifRelayConfig } from '@rsksmart/rif-relay-light-sdk'

import { ChainID, EOAWallet, OnRequest, WalletState } from 'lib/eoaWallet'
import { RelayWallet } from 'lib/relayWallet'

import { Wallet } from '../wallet'
import { ErrorWithMessage } from '../types'

const tiniestAmount = 0.000001

const formatWithDigits = (number: string) => {
  const splitArr = number.split('.')
  const secondPart =
    splitArr[1].length > 8 ? splitArr[1].slice(0, 9) : splitArr[1]

  return [splitArr[0], secondPart].join('.')
}

export const formatSmallNumbers = (smallNumber: string | number) => {
  if (isNaN(Number(smallNumber))) {
    return smallNumber.toString()
  }

  smallNumber = smallNumber.toString()
  const asNumber = Number(smallNumber)

  if (asNumber >= tiniestAmount) {
    return formatWithDigits(smallNumber)
  }

  return asNumber !== 0 ? `< ${tiniestAmount}` : '0.00'
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

export const formatTokenValues = (number: string | number) => {
  // make sure to use this only at the end when showing values
  if (isNaN(Number(number))) {
    return number.toString()
  }
  number = number.toString()
  const asNumber = Number(number)

  if (asNumber < 1) {
    return formatSmallNumbers(number)
  }

  if (number.includes('.') && asNumber > 1) {
    return formatWithDigits(number)
  }

  if (number.length <= 3) {
    return number
  }

  const longNumberArr = number.split('')

  for (let i = number.length - 3; i > 0; i -= 3) {
    longNumberArr.splice(i, 0, ',')
  }

  return longNumberArr.join('')
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

    console.log('CREATE SUBS', subs)

    return () => {
      subs.remove()
    }
  }, [t])

  useEffect(() => {
    if (isFocused) {
      console.log('ENABLE')
      enabled(true)
      enableSecureView()
      return
    }

    console.log('DISABLE')

    enabled(false)
    disableSecureView()
  }, [isFocused])
}

export const getFormattedTokenValue = (tokenValue: string) => {
  if (!tokenValue.includes('.')) {
    return tokenValue
  }
  const tokenValueArr = tokenValue.split('.')
  const decimals = tokenValueArr[1].length

  if (decimals < 8) {
    return tokenValue
  }

  const restDecimals = tokenValueArr[1].split('').slice(7, decimals)

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

  return (
    tokenValueArr[0] +
    '.' +
    tokenValueArr[1].slice(0, 7).concat(...lastAfterZero) +
    ending
  )
}

export const createAppWallet = async (
  mnemonic: string,
  chainId: ChainID,
  jsonRpcProvider: providers.StaticJsonRpcProvider,
  onRequest: OnRequest,
  config: RifRelayConfig,
  cache?: (privateKey: string, mnemonic?: string) => void,
) => {
  const useRelay = Config.USE_RELAY === 'true'
  console.log('USE RELAY createAppWallet', useRelay)
  let wallet: Wallet

  if (useRelay) {
    wallet = await RelayWallet.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      onRequest,
      config,
      cache,
    )
  } else {
    wallet = EOAWallet.create(
      mnemonic,
      chainId,
      jsonRpcProvider,
      onRequest,
      cache,
    )
  }

  return wallet
}

export const loadAppWallet = async (
  keys: WalletState,
  chainId: ChainID,
  jsonRpcProvider: providers.StaticJsonRpcProvider,
  onRequest: OnRequest,
  config: RifRelayConfig,
) => {
  const useRelay = Config.USE_RELAY === 'true'
  console.log('USE RELAY loadAppWallet', useRelay)

  let wallet: Wallet

  if (useRelay) {
    wallet = await RelayWallet.fromWalletState(
      keys,
      chainId,
      jsonRpcProvider,
      onRequest,
      config,
    )
  } else {
    wallet = EOAWallet.fromWalletState(
      keys,
      chainId,
      jsonRpcProvider,
      onRequest,
    )
  }

  return wallet
}
