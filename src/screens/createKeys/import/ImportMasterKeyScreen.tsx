import { useCallback, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  ListRenderItemInfo,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'
import { Trans } from 'react-i18next'
import { CompositeScreenProps } from '@react-navigation/native'

import { validateMnemonic } from 'lib/bip39'

import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator'
import { useKeyboardIsVisible } from 'core/hooks/useKeyboardIsVisible'
import { useAppDispatch } from 'store/storeUtils'
import { createWallet } from 'store/slices/settingsSlice'
import { Arrow } from 'components/icons'
import { PaginationNavigator } from 'components/button/PaginationNavigator'
import { Paragraph } from 'components/index'
import { WordSelector } from '../new/WordSelector'
import { sharedMnemonicStyles } from '../new/styles'
import { SLIDER_WIDTH, WINDOW_WIDTH } from 'src/ux/slides/Dimensions'
import { colors } from 'src/styles/colors'
import { handleInputRefCreation } from 'src/shared/utils'

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.ImportMasterKey>,
  RootStackScreenProps<rootStackRouteNames.CreateKeysUX>
>

const slidesIndexes = [0, 1, 2, 3]

export const ImportMasterKeyScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch()

  const isKeyboardVisible = useKeyboardIsVisible()
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [carousel, setCarousel] = useState<Carousel<number>>()
  const [error, setError] = useState<string | null>(null)

  const handleImportMnemonic = async () => {
    const mnemonicError = validateMnemonic(selectedWords.join(' '))
    if (!mnemonicError) {
      try {
        await dispatch(
          createWallet({
            mnemonic: selectedWords.join(' '),
          }),
        )
      } catch (err) {
        console.error(err)
        setError(
          'error trying to import your master key, please check it and try it again',
        )
      }
    }
    setError(mnemonicError)
  }

  const handleWordSelected = useCallback(
    (wordSelected: string, index: number) => {
      const newSelectedWords = [...selectedWords]
      newSelectedWords[index] = wordSelected
      setSelectedWords(newSelectedWords)
    },
    [selectedWords],
  )

  const handleSlideChange = useCallback((index: number) => {
    setSelectedSlide(index)
    setError('')
  }, [])

  const onSubmitEditing = useCallback(
    (index: number) => {
      carousel?.snapToNext()
      handleSlideChange(index)
    },
    [carousel, handleSlideChange],
  )

  const renderItem = useCallback(
    (
        onWordSelected: (word: string, index: number) => void,
        onSubmitEditingFn: (index: number) => void,
      ) =>
      ({ item }: ListRenderItemInfo<number>) => {
        const groupIndex = 3 * item
        const { firstRef, secondRef, thirdRef } = handleInputRefCreation()

        return (
          <>
            <WordSelector
              ref={firstRef}
              wordIndex={groupIndex}
              nextTextInputRef={secondRef}
              onWordSelected={onWordSelected}
            />
            <WordSelector
              ref={secondRef}
              nextTextInputRef={thirdRef}
              wordIndex={1 + groupIndex}
              onWordSelected={onWordSelected}
            />
            <WordSelector
              ref={thirdRef}
              itemIndex={item}
              wordIndex={2 + groupIndex}
              onWordSelected={onWordSelected}
              onSubmitEditing={onSubmitEditingFn}
            />
          </>
        )
      },
    [],
  )

  return (
    <ScrollView
      style={sharedMnemonicStyles.parent}
      keyboardShouldPersistTaps={'always'}>
      <View style={sharedMnemonicStyles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateKeys')}
          style={styles.returnButton}
          accessibilityLabel="back">
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>
          <Trans>Sign in with a Master Key</Trans>
        </Text>
        <Paragraph style={styles.subHeader}>
          <Trans>
            Input the words you were given when you created your wallet in
            correct order
          </Trans>
        </Paragraph>
      </View>

      <View style={sharedMnemonicStyles.sliderContainer}>
        <Carousel
          inactiveSlideOpacity={0}
          removeClippedSubviews={false} //https://github.com/meliorence/react-native-snap-carousel/issues/238
          ref={c => c && setCarousel(c)}
          data={slidesIndexes}
          renderItem={renderItem(handleWordSelected, onSubmitEditing)}
          sliderWidth={WINDOW_WIDTH}
          // sliderHeight={200}
          itemWidth={SLIDER_WIDTH}
          inactiveSlideShift={0}
          onSnapToItem={handleSlideChange}
          useScrollView={false}
          keyboardShouldPersistTaps={'always'}
          pagingEnabled={false}
        />
      </View>

      {!!error && (
        <View style={styles.errorContainer}>
          <Text accessibilityLabel="error-text">{error}</Text>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={sharedMnemonicStyles.pagnationContainer}>
          <PaginationNavigator
            onPrevious={() => carousel?.snapToPrev()}
            onNext={() => carousel?.snapToNext()}
            onComplete={handleImportMnemonic}
            title={'confirm'}
            currentIndex={selectedSlide}
            slidesAmount={slidesIndexes.length}
            containerBackgroundColor={colors.darkBlue}
          />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  returnButton: {
    zIndex: 1,
  },
  returnButtonView: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 15,
    backgroundColor: colors.purple,
  },

  header: {
    color: colors.white,
    fontSize: 20,
    paddingVertical: 10,
    marginBottom: 5,
    marginLeft: 60,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  subHeader: {
    color: colors.white,
    fontSize: 16,
    marginLeft: 60,
    marginBottom: 40,
    textAlign: 'left',
    width: SLIDER_WIDTH,
  },

  errorContainer: {
    padding: 20,
    marginHorizontal: 60,
    marginBottom: 10,
    borderRadius: 20,
    backgroundColor: colors.red,
  },
  errorText: {
    color: colors.white,
  },
})
