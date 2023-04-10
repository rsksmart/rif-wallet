import { useState, useRef, useCallback, useEffect } from 'react'
import { View, StyleSheet, TextInput, Alert, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome5'

import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator/types'
import { Typography } from 'components/index'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectPin, setPinState, unlockApp } from 'store/slices/settingsSlice'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator'

type PIN = Array<string | null>
const defaultPin = [null, null, null, null]

type Props =
  | SettingsScreenProps<settingsStackRouteNames.ChangePinScreen>
  | RootTabsScreenProps<rootTabsRouteNames.InitialPinScreen>
  | CreateKeysScreenProps<createKeysRouteNames.CreatePIN>

export const PinScreen = ({ navigation, route }: Props) => {
  const { t } = useTranslation()
  const isChangeRequested = route.params?.isChangeRequested
  const dispatch = useAppDispatch()
  const statePIN = useAppSelector(selectPin)
  const textInputRef = useRef<TextInput>(null)

  const [PIN, setPIN] = useState<PIN>(defaultPin)
  const currentPinLength = useRef<number>(0)
  const [confirmPIN, setConfirmPin] = useState<string | null>(null)
  const [isPinEqual, setIsPinEqual] = useState(false)
  const [isNewPinSet, setIsNewPinSet] = useState(false)

  // pin error handling
  const [hasError, setHasError] = useState(false)

  const [title, setTitle] = useState<string>(
    !statePIN ? t('pin_screen_new_pin_title') : t('pin_screen_default_title'),
  )

  const handleNoPinStateCase = useCallback(
    (confirmPin: string | null, curPin: string) => {
      if (!confirmPin) {
        setPIN(defaultPin)
        setConfirmPin(curPin)
        setTitle(t('pin_screen_confirm_pin_title'))
        return
      } else {
        curPin === confirmPin ? setIsPinEqual(true) : setHasError(true)
      }
    },
    [t],
  )

  const handleStatePinCase = useCallback(
    (
      changeRequested: boolean | undefined,
      value: string,
      statePin: string,
      confirmPin: string | null,
    ) => {
      if (!changeRequested) {
        value === statePin ? setIsPinEqual(true) : setHasError(true)
        return
      }

      if (value === statePin) {
        setTitle(t('pin_screen_new_pin_title'))
        setIsNewPinSet(true)
      } else if (confirmPin) {
        value === confirmPin
          ? (() => {
              setIsPinEqual(true)
              setIsNewPinSet(false)
            })()
          : setHasError(true)
      } else if (isNewPinSet) {
        setTitle(t('pin_screen_confirm_pin_title'))
        setConfirmPin(value)
      } else {
        setHasError(true)
      }
    },
    [t, isNewPinSet],
  )

  const onPinTyped = useCallback(
    (value: string) => {
      if (!statePIN) {
        handleNoPinStateCase(confirmPIN, value)
      } else {
        handleStatePinCase(isChangeRequested, value, statePIN, confirmPIN)
      }
    },
    [
      statePIN,
      isChangeRequested,
      confirmPIN,
      handleStatePinCase,
      handleNoPinStateCase,
    ],
  )

  const onPinInput = useCallback(
    (value: string) => {
      const length = value.length

      if (length > defaultPin.length) {
        return
      }

      const newPin = [...PIN]
      const elNumber = length - 1
      newPin.splice(elNumber, 1, value.split('')[elNumber])

      setPIN(newPin)
      currentPinLength.current = length

      if (length === defaultPin.length) {
        onPinTyped(value)
      }
    },
    [PIN, onPinTyped],
  )

  const onKeyPress = useCallback(
    ({ nativeEvent: { key } }) => {
      if (key === 'Backspace') {
        const newPin = [...PIN]
        newPin.splice(currentPinLength.current - 1, 1, null)
        currentPinLength.current -= 1
        setPIN(newPin)
      }
    },
    [PIN],
  )

  useEffect(() => {
    const hasLastDigit = PIN[PIN.length - 1]

    if (hasLastDigit) {
      if (!isChangeRequested && isPinEqual) {
        // if pin exists unlocks the app
        dispatch(unlockApp({ pinUnlocked: true }))
      } else if (isChangeRequested && isPinEqual) {
        // if pin change requested set new pin
        dispatch(setPinState(PIN.join('')))
        navigation.goBack()
      }
      setPIN(defaultPin)
    }
  }, [isChangeRequested, isPinEqual, dispatch, PIN, navigation])

  const errorTimeout = useCallback(() => {
    setTimeout(() => {
      setHasError(false)
    }, 1000)
    return null
  }, [])

  return (
    <View style={sharedStyles.screen}>
      {hasError && errorTimeout()}
      <Typography style={styles.title} type="h2">
        {hasError ? t('pin_screen_wrong_pin') : title}
      </Typography>
      {hasError ? (
        <View style={{ marginTop: 82, alignSelf: 'center' }}>
          <Icon
            name={'times-circle'}
            color={sharedColors.danger}
            size={105}
            solid
          />
        </View>
      ) : (
        <View style={styles.dotWrapper}>
          {PIN.map((n, index) => (
            <View
              key={index}
              style={[
                n && Number(n) >= 0 ? styles.dotActive : styles.dotInactive,
                styles.dot,
              ]}
            />
          ))}
          <TextInput
            ref={textInputRef}
            style={[
              sharedStyles.displayNone,
              Platform.OS === 'android' && styles.androidInputWorkaround,
            ]}
            onChangeText={onPinInput}
            onKeyPress={onKeyPress}
            keyboardType={'number-pad'}
            autoCorrect={false}
            autoFocus
            value={PIN.join('')}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  title: castStyle.text({ marginTop: 58 }),
  dotWrapper: castStyle.view({
    flexDirection: 'row',
    marginTop: 126,
    alignSelf: 'center',
  }),
  dot: castStyle.view({
    height: 12,
    width: 12,
    borderRadius: 6,
    marginRight: 24,
  }),
  dotActive: castStyle.view({
    backgroundColor: sharedColors.primary,
  }),
  dotInactive: castStyle.view({
    backgroundColor: sharedColors.inputInactive,
  }),
  androidInputWorkaround: castStyle.text({
    display: 'flex',
    position: 'absolute',
    bottom: -1000,
  }),
})
