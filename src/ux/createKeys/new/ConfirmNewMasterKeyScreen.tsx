import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

import { CreateKeysProps, ScreenProps } from '../types'
import { Trans } from 'react-i18next'
import { colors } from '../../../styles/colors'

import { Arrow } from '../../../components/icons'
import { SLIDER_WIDTH, WINDOW_WIDTH } from '../../slides/Dimensions'
import { PaginationNavigator } from '../../../components/button/PaginationNavigator'
import { WordSelector } from './WordSelector'
import { sharedMnemonicStyles } from './styles'

interface ConfirmMasterKeyScreenProps {
  isKeyboardVisible: boolean
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ConfirmNewMasterKeyScreen: React.FC<
  ScreenProps<'ConfirmNewMasterKey'> & ConfirmMasterKeyScreenProps
> = ({ route, navigation, createFirstWallet, isKeyboardVisible }) => {
  const mnemonic = route.params.mnemonic
  const slidesIndexes = Array.from(
    { length: Math.ceil(mnemonic.split(' ').length / 3) },
    (_, i) => i,
  )
  const mnemonicWords = mnemonic.split(' ')

  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [carousel, setCarousel] = useState<any>()
  const [error, setError] = useState<boolean>(false)

  const handleConfirmMnemonic = async () => {
    if (selectedWords.join() !== mnemonicWords.join()) {
      return setError(true)
    }

    setError(false)

    await createFirstWallet(mnemonic)
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

  const renderItem: React.FC<{ item: number }> = ({ item }) => {
    const groupIndex = 3 * item
    return (
      <View>
        <WordSelector
          wordIndex={groupIndex}
          expectedWord={mnemonicWords[groupIndex]}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={1 + groupIndex}
          expectedWord={mnemonicWords[groupIndex + 1]}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={2 + groupIndex}
          expectedWord={mnemonicWords[groupIndex + 2]}
          onWordSelected={handleWordSelected}
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
          style={styles.returnButton}>
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
        <Text style={styles.header}>
          <Trans>Your Master Key</Trans>
        </Text>
        <Text style={styles.subHeader}>
          <Trans>Start typing the words in the correct order</Trans>
        </Text>
      </View>

      <View style={sharedMnemonicStyles.sliderContainer}>
        <Carousel
          inactiveSlideOpacity={0}
          removeClippedSubviews={false} //https://github.com/meliorence/react-native-snap-carousel/issues/238
          ref={c => setCarousel(c)}
          data={slidesIndexes}
          renderItem={renderItem}
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
          <Text>The words are not correct.</Text>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={sharedMnemonicStyles.pagnationContainer}>
          <PaginationNavigator
            onPrevious={() => carousel.snapToPrev()}
            onNext={() => carousel.snapToNext()}
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
