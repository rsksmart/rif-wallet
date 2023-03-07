import { CompositeScreenProps } from '@react-navigation/native'
import { useCallback, useState, useRef } from 'react'
import { ScrollView, StyleSheet, TextInput, View } from 'react-native'
import { Pagination } from 'react-native-snap-carousel'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { useTranslation } from 'react-i18next'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { FormProvider, useForm } from 'react-hook-form'
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5'
import { CarouselRenderItemInfo } from 'react-native-reanimated-carousel/lib/typescript/types'

import { validateMnemonic } from 'lib/bip39'

import { AppButton, Input, Typography } from 'components/index'
import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import {
  rootTabsRouteNames,
  RootTabsScreenProps,
} from 'navigation/rootNavigator'
import { castStyle } from 'shared/utils'
import { WINDOW_WIDTH } from 'src/ux/slides/Dimensions'
import { createWallet } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { sharedColors, sharedStyles } from 'shared/constants'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.ImportMasterKey>,
  RootTabsScreenProps<rootTabsRouteNames.CreateKeysUX>
>

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

const SLIDER_WIDTH = WINDOW_WIDTH * 0.8

export const ImportMasterKeyScreen = ({ navigation }: Props) => {
  const { t } = useTranslation()

  const dispatch = useAppDispatch()
  const words = useRef<string[]>([...initialWords])
  const inputsRef = useRef<Record<string, TextInput>>({})
  const carouselRef = useRef<ICarouselInstance>(null)

  const form = useForm({
    defaultValues: {
      ...words.current,
    },
  })
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [status, setStatus] = useState<StatusActions>(StatusActions.INITIAL)

  const handleImportMnemonic = useCallback(async () => {
    if (status === StatusActions.ERROR) {
      setStatus(StatusActions.INITIAL)
      return
    }
    const mnemonicError = validateMnemonic(words.current.join(' '))
    if (mnemonicError) {
      setStatus(StatusActions.ERROR)
      return
    }

    try {
      await dispatch(
        createWallet({
          mnemonic: words.current.join(' '),
        }),
      )
    } catch (err) {
      if (err instanceof Error) {
        throw new Error(err.toString())
      }
    }
  }, [dispatch, status])

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

  const renderItem = useCallback(
    (item: CarouselRenderItemInfo<number>) => {
      const groupIndex = 3 * item.index

      const isLastIndex = slidesIndexes[slidesIndexes.length - 1] === item.index

      const onChangeText = (index: number) => (value: string) => {
        words.current[index - 1] = value
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
            label={`Word ${firstItemId}`}
            inputName={`${firstItemId}`}
            placeholder={`Word ${firstItemId}`}
            rightIcon={<></>}
            onChangeText={onChangeText(firstItemId)}
            inputRef={onSetRef(firstItemId)}
            onSubmitEditing={onInputSubmitEditing(firstItemId)}
            autoCapitalize="none"
          />
          <Input
            label={`Word ${secondItemId}`}
            inputName={`${secondItemId}`}
            placeholder={`Word ${secondItemId}`}
            rightIcon={<></>}
            onChangeText={onChangeText(secondItemId)}
            inputRef={onSetRef(secondItemId)}
            onSubmitEditing={onInputSubmitEditing(secondItemId)}
            autoCapitalize="none"
          />
          <Input
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
          />
        </View>
      )
    },
    [handleImportMnemonic, onSubmitEditing],
  )

  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  return (
    <FormProvider {...form}>
      <ScrollView style={styles.parent} keyboardShouldPersistTaps={'always'}>
        <View style={styles.headerStyle}>
          <View style={sharedStyles.flex}>
            <FontAwesome5Icon
              name="chevron-left"
              size={16}
              color="white"
              onPress={onBackPress}
              style={sharedStyles.widthHalfWidth}
            />
          </View>
          <View style={[sharedStyles.flex, styles.flexCenter]}>
            <Typography type="h4">{t('header_import_wallet')}</Typography>
          </View>
          <View style={sharedStyles.flex} />
        </View>
        <View style={styles.phraseView}>
          {status === StatusActions.INITIAL && (
            <Typography type="h3">{t('header_enter_your_phrase')}</Typography>
          )}
          {status === StatusActions.SUCCESS && (
            <Typography type="h3">{t('header_phrase_correct')}</Typography>
          )}
          {status === StatusActions.ERROR && (
            <Typography type="h3">{t('header_phrase_not_correct')}</Typography>
          )}
        </View>
        <View
          style={
            status !== StatusActions.INITIAL ? styles.hideCarouselView : null
          }>
          <GestureHandlerRootView>
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
          <StatusIcon status={status} />
        </View>
        <Pagination
          dotsLength={4}
          activeDotIndex={selectedSlide}
          dotStyle={styles.dotStyleView}
          inactiveDotStyle={{}}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
        <AppButton
          title="OK"
          color="white"
          textColor="black"
          textType="body2"
          textStyle={styles.textStyleText}
          onPress={handleImportMnemonic}
        />
      </ScrollView>
    </FormProvider>
  )
}

const StatusIcon = ({ status }: { status: StatusActions }) => {
  const iconStyle = {
    backgroundColor: status === StatusActions.SUCCESS ? '#59FF9C' : '#FF3559',
    borderRadius: 50,
  }
  switch (status) {
    case StatusActions.SUCCESS:
      return (
        <AntDesign
          name="checkcircleo"
          size={100}
          style={iconStyle}
          color="black"
        />
      )
    case StatusActions.ERROR:
      return <Feather name="x" size={100} style={iconStyle} color="black" />
    default:
      return null
  }
}

const styles = StyleSheet.create({
  parent: castStyle.view({
    backgroundColor: sharedColors.secondary,
    minHeight: '100%',
    paddingHorizontal: 24,
  }),
  headerStyle: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 22,
    marginBottom: 40,
  }),
  flexCenter: castStyle.view({
    alignItems: 'center',
  }),
  phraseView: castStyle.view({
    marginBottom: 20,
  }),
  hideCarouselView: castStyle.view({
    display: 'none',
  }),
  inputMarginView: castStyle.view({
    marginLeft: '4%',
  }),
  dotStyleView: castStyle.view({
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  }),
  textStyleText: castStyle.text({
    fontWeight: 'bold',
  }),
})
