import { useCallback, useState, useRef } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import Dots from 'react-native-dots-pagination'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useTranslation } from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FormProvider, useForm } from 'react-hook-form'
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types'

import { validateMnemonic } from 'lib/bip39'

import { AppButton, Input, Typography } from 'components/index'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { castStyle } from 'shared/utils'
import { createWallet } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { SLIDER_WIDTH, sharedColors, sharedStyles } from 'shared/constants'
import { useInitializeWallet } from 'shared/wallet'

const slidesIndexes = [0, 1, 2, 3]

enum StatusActions {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  INITIAL = 'INITIAL',
}

const initialWords = Array.from({ length: slidesIndexes.length * 3 }).reduce<
  string[]
>((prev, _next, index) => {
  prev[index] = ''
  return prev
}, [])

const headerTextMap = new Map([
  [StatusActions.ERROR, 'header_phrase_not_correct'],
  [StatusActions.INITIAL, 'header_enter_your_phrase'],
  [StatusActions.SUCCESS, 'header_phrase_correct'],
])

const StatusIcon = ({ status }: { status: StatusActions }) => {
  const iconStyle = {
    backgroundColor:
      status === StatusActions.SUCCESS
        ? sharedColors.successLight
        : sharedColors.errorBackground,
    borderRadius: 50,
  }
  switch (status) {
    case StatusActions.SUCCESS:
      return (
        <AntDesign
          name="checkcircleo"
          size={100}
          style={iconStyle}
          color={sharedColors.black}
        />
      )
    case StatusActions.ERROR:
      return (
        <Feather
          name="x"
          size={100}
          style={iconStyle}
          color={sharedColors.black}
        />
      )
    default:
      return null
  }
}

export const ImportMasterKeyScreen = (
  _: CreateKeysScreenProps<createKeysRouteNames.ImportMasterKey>,
) => {
  const initializeWallet = useInitializeWallet()
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const words = useRef<string[]>(initialWords)
  const inputsRef = useRef<Record<string, TextInput>>({})
  const carouselRef = useRef<ICarouselInstance>(null)

  const form = useForm({
    defaultValues: {
      ...words.current,
    },
  })
  const { setValue } = form
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [status, setStatus] = useState<StatusActions>(StatusActions.INITIAL)
  const [isLoading, setIsLoading] = useState(false)

  const handleImportMnemonic = useCallback(async () => {
    // immediatly set loading to avoid double-tap
    setIsLoading(true)

    if (status === StatusActions.ERROR) {
      setStatus(StatusActions.INITIAL)
      return
    }

    const mnemonicError = validateMnemonic(words.current.join(' '))

    if (mnemonicError) {
      setStatus(StatusActions.ERROR)
      // mnemonic failed set loading back to false
      setIsLoading(false)
      return
    }

    try {
      setTimeout(async () => {
        await dispatch(
          createWallet({
            mnemonic: words.current.join(' '),
            initializeWallet,
          }),
        )
        form.reset()
        setIsLoading(false)
      }, 500)
    } catch (err) {
      setIsLoading(false)
      if (err instanceof Error) {
        throw new Error(err.toString())
      }
    }
  }, [dispatch, status, initializeWallet, form])

  const handleSlideChange = useCallback((index: number) => {
    setSelectedSlide(index)
    setStatus(StatusActions.INITIAL)
  }, [])

  const onSubmitEditing = useCallback(
    (index: number, shouldSnapToNext = false) => {
      if (shouldSnapToNext && carouselRef.current) {
        carouselRef.current.next()
      }
      inputsRef.current[index + 1].focus()
    },
    [],
  )

  const errorTimeout = useCallback(() => {
    setTimeout(() => {
      setStatus(StatusActions.INITIAL)
    }, 1000)
    return null
  }, [])

  const renderItem = useCallback(
    (item: CarouselRenderItemInfo<number>) => {
      const groupIndex = 3 * item.index

      const isLastIndex = slidesIndexes[slidesIndexes.length - 1] === item.index

      const onChangeText = (index: number) => (value: string) => {
        words.current[index - 1] = value.trim()
        setValue(index.toString() as `${number}`, value.trim())
      }

      const onSetRef = (index: number) => (ref: TextInput) => {
        inputsRef.current[index] = ref
      }

      const onInputSubmitEditing =
        (index: number, shouldSnapToNext = false) =>
        () =>
          onSubmitEditing(index, shouldSnapToNext)

      const firstItemId = groupIndex + 1
      const secondItemId = groupIndex + 2
      const thirdItemId = groupIndex + 3

      return (
        <View style={styles.inputMarginView}>
          <Input
            accessibilityLabel={`word-${firstItemId}`}
            label={`Word ${firstItemId}`}
            inputName={`${firstItemId}`}
            placeholder={`Word ${firstItemId}`}
            rightIcon={<></>}
            onChangeText={onChangeText(firstItemId)}
            inputRef={onSetRef(firstItemId)}
            onSubmitEditing={onInputSubmitEditing(firstItemId)}
            autoCapitalize="none"
            blurOnSubmit={false}
          />
          <Input
            accessibilityLabel={`word-${secondItemId}`}
            label={`Word ${secondItemId}`}
            inputName={`${secondItemId}`}
            placeholder={`Word ${secondItemId}`}
            rightIcon={<></>}
            onChangeText={onChangeText(secondItemId)}
            inputRef={onSetRef(secondItemId)}
            onSubmitEditing={onInputSubmitEditing(secondItemId)}
            autoCapitalize="none"
            blurOnSubmit={false}
          />
          <Input
            accessibilityLabel={`word-${thirdItemId}`}
            label={`Word ${thirdItemId}`}
            inputName={`${thirdItemId}`}
            placeholder={`Word ${thirdItemId}`}
            rightIcon={<></>}
            onChangeText={onChangeText(thirdItemId)}
            inputRef={onSetRef(thirdItemId)}
            onSubmitEditing={
              !isLastIndex
                ? onInputSubmitEditing(thirdItemId, true)
                : handleImportMnemonic
            }
            autoCapitalize="none"
            blurOnSubmit={isLastIndex}
          />
        </View>
      )
    },
    [handleImportMnemonic, onSubmitEditing, setValue],
  )

  return (
    <FormProvider {...form}>
      {errorTimeout()}
      <ScrollView style={styles.parent} keyboardShouldPersistTaps={'always'}>
        <Typography
          style={styles.titleText}
          type="h3"
          accessibilityLabel={StatusActions.ERROR}>
          {t(headerTextMap.get(status))}
        </Typography>
        <View
          style={
            status !== StatusActions.INITIAL ? styles.hideCarouselView : null
          }>
          <GestureHandlerRootView style={styles.wordsContainer}>
            <Carousel
              data={slidesIndexes}
              renderItem={renderItem}
              vertical={false}
              width={SLIDER_WIDTH}
              loop={false}
              style={sharedStyles.widthFullWidth}
              onScrollEnd={handleSlideChange}
              snapEnabled={false}
              height={SLIDER_WIDTH}
              ref={carouselRef}
            />
          </GestureHandlerRootView>
        </View>
        <View style={styles.flexCenter}>
          <View style={styles.iconBorderFixView}>
            <StatusIcon status={status} />
          </View>
        </View>
        {status !== StatusActions.ERROR && (
          <Dots
            length={4}
            active={selectedSlide}
            activeColor={sharedColors.white}
            activeDotWidth={8}
            activeDotHeight={8}
            passiveColor={sharedColors.inputActive}
            passiveDotHeight={6}
            passiveDotWidth={6}
            marginHorizontal={6}
          />
        )}

        {status !== StatusActions.ERROR && (
          <AppButton
            accessibilityLabel={'OK'}
            title={t('ok')}
            color={sharedColors.white}
            textColor={sharedColors.black}
            textType={'body2'}
            textStyle={sharedStyles.fontBoldText}
            onPress={handleImportMnemonic}
            style={styles.appButtonStyleView}
            loading={isLoading}
            disabled={isLoading}
          />
        )}
      </ScrollView>
    </FormProvider>
  )
}

const styles = StyleSheet.create({
  parent: castStyle.view({
    backgroundColor: sharedColors.black,
    flex: 1,
    paddingHorizontal: 24,
  }),
  wordsContainer: castStyle.view({
    marginTop: 20,
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
  titleText: castStyle.text({
    alignSelf: 'center',
    marginTop: 42,
    marginBottom: 20,
  }),
  hideCarouselView: castStyle.view({
    display: 'none',
  }),
  inputMarginView: castStyle.view({
    marginLeft: '4%',
  }),
  iconBorderFixView: castStyle.view({
    overflow: 'hidden',
    borderRadius: 50,
  }),
  appButtonStyleView: castStyle.view({
    marginTop: 30,
  }),
})
