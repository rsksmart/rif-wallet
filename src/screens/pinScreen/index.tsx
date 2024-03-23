import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
  View,
  StyleSheet,
  TextInput,
  Platform,
  ColorValue,
  BackHandler,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useIsFocused } from '@react-navigation/native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { screenOptionsWithHeader } from 'navigation/index'
import {
  AppButton,
  AppButtonBackgroundVarietyEnum,
  Typography,
} from 'components/index'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  selectIsUnlocked,
  setFullscreen,
  setUnlocked,
  unlockApp,
} from 'store/slices/settingsSlice'
import { selectPin, setPinState } from 'store/slices/persistentDataSlice'
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
import { useInitializeWallet } from 'shared/wallet'
import { useSetGlobalError } from 'components/GlobalErrorHandler'

type PIN = Array<string | null>
const defaultPin = [null, null, null, null]

// pin exist
const pinExistNoSteps = [
  sharedColors.inputActive,
  sharedColors.inputActive,
  sharedColors.inputActive,
]
const pinExistFirstStep = [
  sharedColors.successLight,
  sharedColors.inputActive,
  sharedColors.inputActive,
]
const pinExistSecondStep = [
  sharedColors.successLight,
  sharedColors.successLight,
  sharedColors.inputActive,
]
const pinExistComplete = [
  sharedColors.successLight,
  sharedColors.successLight,
  sharedColors.successLight,
]

// no pin exist
const noPinExistNoSteps = [sharedColors.inputActive, sharedColors.inputActive]
const noPinExistFirstStep = [
  sharedColors.successLight,
  sharedColors.inputActive,
]
const noPinExistComplete = [
  sharedColors.successLight,
  sharedColors.successLight,
]

interface InitialPinSettings {
  headerTitle: string
  initialPinTitle: string
  initialSteps: ColorValue[] | null
}

enum TestID {
  OpenKeyboardButton = 'Button.OpenKeyboard',
  PINDot = 'PINDot',
}

const getInitialPinSettings = (
  isChangeRequested: boolean | undefined,
  pin: string | null,
  t: ReturnType<typeof useTranslation>['t'],
): InitialPinSettings => {
  if (!isChangeRequested && pin) {
    return {
      headerTitle: t('pin_screen_header_title'),
      initialPinTitle: t('pin_screen_default_title'),
      initialSteps: null,
    }
  } else if (isChangeRequested && pin) {
    return {
      headerTitle: t('pin_screen_change_pin'),
      initialPinTitle: t('pin_screen_old_pin_title'),
      initialSteps: pinExistNoSteps,
    }
  } else if (isChangeRequested && !pin) {
    return {
      headerTitle: t('pin_screen_pin_setup'),
      initialPinTitle: t('pin_screen_new_pin_title'),
      initialSteps: noPinExistNoSteps,
    }
  } else {
    return {
      headerTitle: t('pin_screen_pin_setup'),
      initialPinTitle: t('pin_screen_new_pin_title'),
      initialSteps: noPinExistNoSteps,
    }
  }
}

type Props =
  | SettingsScreenProps<settingsStackRouteNames.ChangePinScreen>
  | CreateKeysScreenProps<createKeysRouteNames.PinScreen>

export const PinScreen = ({ navigation, route }: Props) => {
  const initializeWallet = useInitializeWallet()
  const setGlobalError = useSetGlobalError()
  const insets = useSafeAreaInsets()
  const isFocused = useIsFocused()
  // const isVisible = useKeyboardIsVisible()
  const { t } = useTranslation()
  // screen params
  const isChangeRequested = route.params?.isChangeRequested
  const backScreen = route.params?.backScreen
  const dispatch = useAppDispatch()
  const statePIN = useAppSelector(selectPin)
  const unlocked = useAppSelector(selectIsUnlocked)
  const textInputRef = useRef<TextInput>(null)

  const [PIN, setPIN] = useState<PIN>(defaultPin)
  const currentPinLength = useRef<number>(0)
  const [confirmPIN, setConfirmPin] = useState<string | null>(null)
  const [isPinEqual, setIsPinEqual] = useState(false)
  const [isNewPinSet, setIsNewPinSet] = useState(false)
  const { headerTitle, initialSteps, initialPinTitle } = useMemo(
    () => getInitialPinSettings(isChangeRequested, statePIN, t),
    [isChangeRequested, statePIN, t],
  )
  const [steps, setSteps] = useState<ColorValue[] | null>(initialSteps)

  // pin error handling
  const [hasError, setHasError] = useState(false)

  const [title, setTitle] = useState<string>(initialPinTitle)

  const focusInput = useCallback(() => {
    if (textInputRef.current) {
      if (textInputRef.current.isFocused()) {
        textInputRef.current.blur()
      }
      textInputRef.current.focus()
    }
  }, [])

  // disable Android back button
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', () => true)
  }, [])

  const resetPin = useCallback(() => {
    setTimeout(() => setPIN(defaultPin), 100)
  }, [])

  const handleNoPinStateCase = useCallback(
    (confirmPin: string | null, curPin: string) => {
      if (!confirmPin) {
        setSteps(noPinExistFirstStep)
        setConfirmPin(curPin)
        setTitle(t('pin_screen_confirm_pin_title'))
        resetPin()
      } else {
        curPin === confirmPin
          ? (() => {
              setIsPinEqual(true)
              dispatch(setPinState(curPin))
              setSteps(noPinExistComplete)
            })()
          : setHasError(true)
      }
    },
    [t, resetPin, dispatch],
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
        setSteps(pinExistFirstStep)
      } else if (confirmPin) {
        value === confirmPin
          ? (() => {
              setIsPinEqual(true)
              setIsNewPinSet(false)
              setSteps(pinExistComplete)
            })()
          : setHasError(true)
      } else if (isNewPinSet) {
        setTitle(t('pin_screen_confirm_pin_title'))
        setConfirmPin(value)
        setSteps(pinExistSecondStep)
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
      // only digits
      if (isNaN(Number(value))) {
        return
      }

      if (length > defaultPin.length) {
        return
      }

      const newPin = [...PIN]
      const elNumber = length - 1
      newPin.splice(elNumber, 1, value.split('')[elNumber])

      setPIN(newPin)
      currentPinLength.current = length

      if (length === defaultPin.length) {
        setTimeout(() => onPinTyped(value), 100)
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

  const handleLastDigit = useCallback(() => {
    if (!isChangeRequested && isPinEqual) {
      // if pin exists unlocks the app
      dispatch(
        unlockApp({ pinUnlocked: true, initializeWallet, setGlobalError }),
      )
    } else if (isChangeRequested && isPinEqual) {
      // if pin change requested set new pin
      setTimeout(() => {
        dispatch(setPinState(PIN.join('')))
        !unlocked && dispatch(setUnlocked(true))
        navigation.goBack()
      }, 1000)
    }

    resetPin()
  }, [
    unlocked,
    isChangeRequested,
    isPinEqual,
    resetPin,
    dispatch,
    PIN,
    navigation,
    initializeWallet,
    setGlobalError,
  ])

  useEffect(() => {
    const hasLastDigit = PIN[PIN.length - 1]

    if (hasLastDigit) {
      setTimeout(handleLastDigit, 100)
    }
  }, [PIN, handleLastDigit])

  // workaround for android devices which do not open keyboard
  // on autoFocus
  // useEffect(() => {
  //   if (!isVisible) {
  //     focusInput()
  //   }
  // }, [isVisible, focusInput])

  const errorTimeout = useCallback(() => {
    setTimeout(() => {
      setHasError(false)
    }, 1000)
    return null
  }, [])

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
    return () => {
      dispatch(setFullscreen(false))
    }
  }, [dispatch, isFocused])

  const resetState = useCallback(() => {
    setTitle(initialPinTitle)
    setSteps(initialSteps)
    setConfirmPin(null)
    setIsNewPinSet(false)
  }, [initialPinTitle, initialSteps])

  useEffect(() => {
    let goBack: () => void = navigation.goBack
    let shouldShowBackButton = true

    if (isNewPinSet || confirmPIN) {
      goBack = resetState
    } else if (backScreen) {
      goBack = () => navigation.navigate(backScreen)
    } else {
      shouldShowBackButton = false
    }

    navigation.setOptions(
      screenOptionsWithHeader(
        insets.top,
        headerTitle,
        undefined,
        steps ?? undefined,
        !shouldShowBackButton,
        goBack,
      ),
    )
  }, [
    navigation,
    insets,
    steps,
    backScreen,
    headerTitle,
    isNewPinSet,
    confirmPIN,
    resetState,
  ])

  return (
    <View style={sharedStyles.screen}>
      {isChangeRequested && isPinEqual ? (
        <Icon
          name={'check-circle'}
          style={styles.errorIcon}
          color={sharedColors.successLight}
          size={105}
          solid
        />
      ) : (
        <>
          {hasError && errorTimeout()}
          <Typography
            style={styles.title}
            type="h2"
            accessibilityLabel={'new_pin'}>
            {hasError ? t('pin_screen_wrong_pin') : title}
          </Typography>
          {hasError ? (
            <Icon
              style={styles.errorIcon}
              name={'times-circle'}
              color={sharedColors.danger}
              size={105}
              solid
            />
          ) : (
            <View style={styles.dotWrapper}>
              {PIN.map((n, index) => (
                <View
                  key={index}
                  style={[
                    n && Number(n) >= 0 ? styles.dotActive : styles.dotInactive,
                    styles.dot,
                  ]}
                  accessibilityLabel={`${index}.${TestID.PINDot}`}
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
          <AppButton
            style={[
              sharedStyles.appButtonBottom,
              { backgroundColor: sharedColors.black },
            ]}
            onPress={focusInput}
            title={t('pin_settings_open_keyboard_btn')}
            textColor={sharedColors.white}
            backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
            accessibilityLabel={TestID.OpenKeyboardButton}
          />
        </>
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
  errorIcon: castStyle.text({ marginTop: 82, alignSelf: 'center' }),
})
