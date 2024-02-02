import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'

import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { castStyle, getRandomNumber } from 'shared/utils'
import { AppButton, Input, Typography } from 'components/index'
import { createWallet } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { sharedColors, sharedStyles } from 'shared/constants'
import { StepperComponent } from 'src/components/profile'
import { useInitializeWallet } from 'shared/wallet'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'

type ConfirmNewMasterKey =
  | CreateKeysScreenProps<createKeysRouteNames.ConfirmNewMasterKey>
  | RootTabsScreenProps<rootTabsRouteNames.ConfirmNewMasterKey>

type MnemonicWordNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

const wordNumberMap = new Map<MnemonicWordNumber, string>([
  [1, 'st'],
  [2, 'nd'],
  [3, 'rd'],
  [4, 'th'],
  [5, 'th'],
  [6, 'th'],
  [7, 'th'],
  [8, 'th'],
  [9, 'th'],
  [10, 'th'],
  [11, 'th'],
  [12, 'th'],
])

interface RandomWord {
  word: string
  orderNumber: MnemonicWordNumber
}

interface FormValues {
  firstWord: string
  secondWord: string
}

const onRandomWordChoice = (_mnemonicWords: string[]) => {
  const max = _mnemonicWords.length - 1
  const min = 0

  const firstWordIndex = getRandomNumber(max, min)
  const secondWordIndex = getRandomNumber(max, min)

  if (firstWordIndex !== secondWordIndex) {
    const firstWord: RandomWord = {
      word: _mnemonicWords[firstWordIndex],
      orderNumber: (firstWordIndex + 1) as MnemonicWordNumber,
    }
    const secondWord: RandomWord = {
      word: _mnemonicWords[secondWordIndex],
      orderNumber: (secondWordIndex + 1) as MnemonicWordNumber,
    }

    const randomWordsTuple = [firstWord, secondWord]
    if (firstWordIndex > secondWordIndex) {
      randomWordsTuple.reverse()
    }

    return randomWordsTuple
  } else {
    onRandomWordChoice(_mnemonicWords)
    return
  }
}

export const ConfirmNewMasterKeyScreen = ({ route }: ConfirmNewMasterKey) => {
  const initializeWallet = useInitializeWallet()
  const { t } = useTranslation()
  const methods = useForm<FormValues>({
    mode: 'onSubmit',
    defaultValues: {
      firstWord: '',
      secondWord: '',
    },
  })
  const {
    handleSubmit,
    setError,
    resetField,
    reset,
    formState: { errors },
  } = methods
  const formIsValid = useMemo(
    () => !errors.firstWord && !errors.secondWord,
    [errors.firstWord, errors.secondWord],
  )
  const dispatch = useAppDispatch()
  const mnemonic = route.params.mnemonic
  const mnemonicWords = useMemo(() => mnemonic.split(' '), [mnemonic])
  const randomWords = useMemo(
    () => onRandomWordChoice(mnemonicWords),
    [mnemonicWords],
  )
  const firstWordLabel = useMemo(
    () =>
      randomWords
        ? `${randomWords[0].orderNumber}${wordNumberMap.get(
            randomWords[0].orderNumber,
          )} word`
        : '',
    [randomWords],
  )
  const secondWordLabel = useMemo(
    () =>
      randomWords
        ? `${randomWords[1].orderNumber}${wordNumberMap.get(
            randomWords[1].orderNumber,
          )} word`
        : '',
    [randomWords],
  )
  const [hasFormSuccess, setHasFormSuccess] = useState<boolean>(false)

  const onSubmitEditing = useCallback(
    async (values: FormValues) => {
      const firstWord = mnemonicWords.find(w => w === values.firstWord)
      const secondWord = mnemonicWords.find(w => w === values.secondWord)

      if (!firstWord) {
        setError('firstWord', { message: t('confirm_key_input_error') })
        return
      }
      if (!secondWord) {
        setError('secondWord', { message: t('confirm_key_input_error') })
        return
      }

      setHasFormSuccess(true)
    },
    [mnemonicWords, setError, t],
  )

  useEffect(() => {
    if (!formIsValid) {
      setTimeout(() => {
        reset()
      }, 1000)
    }
  }, [formIsValid, reset])

  useEffect(() => {
    if (hasFormSuccess) {
      setTimeout(() => {
        dispatch(createWallet({ mnemonic, initializeWallet }))
      }, 1000)
    }
  }, [hasFormSuccess, dispatch, mnemonic, initializeWallet])

  return (
    <View style={styles.screen}>
      <StepperComponent
        width={40}
        colors={[sharedColors.primary, sharedColors.primary]}
        style={sharedStyles.selfCenter}
      />
      <ScrollView keyboardShouldPersistTaps={'handled'}>
        <Typography type={'h2'} style={styles.titleText}>
          {t('confirm_key_title')}
        </Typography>
        <FormProvider {...methods}>
          <Input
            containerStyle={styles.firstInputContainer}
            label={firstWordLabel}
            placeholder={firstWordLabel}
            inputName={'firstWord'}
            resetValue={() => resetField('firstWord')}
            autoCapitalize={'none'}
          />

          <Input
            label={secondWordLabel}
            placeholder={secondWordLabel}
            inputName={'secondWord'}
            resetValue={() => resetField('secondWord')}
            autoCapitalize={'none'}
          />
        </FormProvider>
      </ScrollView>
      <AppButton
        style={styles.button}
        title={t('confirm_key_button')}
        onPress={handleSubmit(onSubmitEditing)}
        color={sharedColors.white}
        textColor={sharedColors.black}
      />
      {!formIsValid || hasFormSuccess ? (
        <View style={StyleSheet.absoluteFill}>
          <View style={[StyleSheet.absoluteFill, styles.backgroundOverlay]} />
          <Typography
            style={styles.feedbackText}
            type={'h2'}
            color={sharedColors.white}>
            {hasFormSuccess ? t('confirm_key_success') : t('confirm_key_error')}
          </Typography>
          <Icon
            solid
            name={hasFormSuccess ? 'check-circle' : 'times-circle'}
            size={106}
            color={
              hasFormSuccess ? sharedColors.successLight : sharedColors.danger
            }
            style={styles.feedbackIcon}
          />
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.black,
    paddingHorizontal: 24,
  }),
  titleText: castStyle.text({ marginTop: 58, letterSpacing: -0.3 }),
  backgroundOverlay: castStyle.view({
    backgroundColor: sharedColors.black,
  }),
  firstInputContainer: castStyle.view({ marginTop: 32 }),
  button: castStyle.view({
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
  feedbackText: castStyle.text({ marginTop: 58, marginLeft: 24 }),
  feedbackIcon: castStyle.text({ alignSelf: 'center', marginTop: 58 }),
})
