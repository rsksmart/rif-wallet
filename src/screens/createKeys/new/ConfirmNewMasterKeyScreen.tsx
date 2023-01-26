import { useCallback, useState } from 'react'
import { Trans } from 'react-i18next'
import {
  ListRenderItemInfo,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { PaginationNavigator } from 'components/button/PaginationNavigator'
import { Arrow } from 'components/icons'
import { useKeyboardIsVisible } from 'core/hooks/useKeyboardIsVisible'
import { CreateKeysScreenProps } from 'navigation/createKeysNavigator/types'
import { handleInputRefCreation } from 'shared/utils'
import { RegularText, SemiBoldText } from 'src/components'
import { colors } from 'src/styles/colors'
import { saveKeyVerificationReminder } from 'storage/MainStorage'
import { createWallet } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { SLIDER_WIDTH, WINDOW_WIDTH } from '../../../ux/slides/Dimensions'
import { sharedMnemonicStyles } from './styles'
import { WordSelector } from './WordSelector'

export const ConfirmNewMasterKeyScreen = ({
  route,
  navigation,
}: CreateKeysScreenProps<'ConfirmNewMasterKey'>) => {
  const dispatch = useAppDispatch()
  const isKeyboardVisible = useKeyboardIsVisible()
  const mnemonic = route.params.mnemonic
  const slidesIndexes = Array.from(
    { length: Math.ceil(mnemonic.split(' ').length / 3) },
    (_, i) => i,
  )
  const mnemonicWords = mnemonic.split(' ')

  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [carousel, setCarousel] = useState<Carousel<number>>()
  const [error, setError] = useState<boolean>(false)

  const handleConfirmMnemonic = async () => {
    if (selectedWords.join() !== mnemonicWords.join()) {
      return setError(true)
    }
    setError(false)
    saveKeyVerificationReminder(false)
    await dispatch(createWallet({ mnemonic }))
  }

  const handleWordSelected = (wordSelected: string, index: number) => {
    const newSelectedWords = [...selectedWords]
    newSelectedWords[index] = wordSelected
    setSelectedWords(newSelectedWords)
  }

  const handleSlideChange = (index: number) => {
    setSelectedSlide(index)
    setError(false)
  }

  const onSubmitEditing = useCallback(
    (index: number) => {
      carousel?.snapToNext()
      handleSlideChange(index)
    },
    [carousel],
  )

  const renderItem =
    (
      onWordSelected: (word: string, index: number) => void,
      onSubmitEditingFn: (index: number) => void,
    ) =>
    ({ item }: ListRenderItemInfo<number>) => {
      const groupIndex = 3 * item

      const { firstRef, secondRef, thirdRef } = handleInputRefCreation()

      return (
        <View>
          <WordSelector
            ref={firstRef}
            nextTextInputRef={secondRef}
            wordIndex={groupIndex}
            expectedWord={mnemonicWords[groupIndex]}
            onWordSelected={onWordSelected}
          />
          <WordSelector
            ref={secondRef}
            nextTextInputRef={thirdRef}
            wordIndex={1 + groupIndex}
            expectedWord={mnemonicWords[groupIndex + 1]}
            onWordSelected={handleWordSelected}
          />
          <WordSelector
            ref={thirdRef}
            itemIndex={item}
            wordIndex={2 + groupIndex}
            expectedWord={mnemonicWords[groupIndex + 2]}
            onWordSelected={onWordSelected}
            onSubmitEditing={onSubmitEditingFn}
          />
        </View>
      )
    }

  return (
    <ScrollView
      style={sharedMnemonicStyles.parent}
      keyboardShouldPersistTaps="always">
      <View style={sharedMnemonicStyles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('NewMasterKey')}
          style={styles.returnButton}
          accessibilityLabel="back">
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
        <SemiBoldText style={styles.header}>
          <Trans>Your Master Key</Trans>
        </SemiBoldText>
        <RegularText style={styles.subHeader}>
          <Trans>Start typing the words in the correct order</Trans>
        </RegularText>
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
          keyboardShouldPersistTaps="always"
          pagingEnabled={false}
        />
      </View>

      {error && (
        <View style={styles.errorContainer}>
          <RegularText>The words are not correct.</RegularText>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={sharedMnemonicStyles.pagnationContainer}>
          <PaginationNavigator
            onPrevious={() => carousel?.snapToPrev()}
            onNext={() => carousel?.snapToNext()}
            onComplete={handleConfirmMnemonic}
            title="confirm"
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
    fontSize: 18,
    paddingVertical: 10,
    marginBottom: 5,
    marginLeft: 60,
    textAlign: 'left',
  },
  subHeader: {
    color: colors.white,
    fontSize: 14,
    marginLeft: 60,
    marginBottom: 40,
    textAlign: 'left',
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
