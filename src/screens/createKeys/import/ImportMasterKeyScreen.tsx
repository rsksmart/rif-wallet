import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

import {
  CreateKeysProps,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { Trans } from 'react-i18next'
import { colors } from '../../../styles/colors'

import { Arrow } from '../../../components/icons'
import { SLIDER_WIDTH, WINDOW_WIDTH } from '../../../ux/slides/Dimensions'
import { PaginationNavigator } from '../../../components/button/PaginationNavigator'
import { WordSelector } from '../new/WordSelector'
import { sharedMnemonicStyles } from '../new/styles'
import { Paragraph } from '../../../components'
import { validateMnemonic } from '../../../lib/bip39'

interface ImportMasterKeyScreenProps {
  isKeyboardVisible: boolean
  createWallet: CreateKeysProps['createFirstWallet']
}

export const ImportMasterKeyScreen: React.FC<
  CreateKeysScreenProps<'ImportMasterKey'> & ImportMasterKeyScreenProps
> = ({ navigation, createWallet, isKeyboardVisible }) => {
  const slidesIndexes = [0, 1, 2, 3]

  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [carousel, setCarousel] = useState<any>()
  const [error, setError] = useState<string | null>(null)

  const handleImportMnemonic = async () => {
    const mnemonicError = validateMnemonic(selectedWords.join(' '))
    if (!mnemonicError) {
      try {
        await createWallet(selectedWords.join(' '))
      } catch (err) {
        console.error(err)
        setError(
          'error trying to import your master key, please check it and try it again',
        )
      }
    }
    setError(mnemonicError)
  }

  const handleWordSelected = (wordSelected: string, index: number) => {
    const newSelectedWords = [...selectedWords]
    newSelectedWords[index] = wordSelected
    setSelectedWords(newSelectedWords)
  }

  const handleSlideChange = (index: number) => {
    setSelectedSlide(index)
    setError('')
  }

  const renderItem: React.FC<{ item: number }> = ({ item }) => {
    const groupIndex = 3 * item
    return (
      <View>
        <WordSelector
          wordIndex={groupIndex}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={1 + groupIndex}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={2 + groupIndex}
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
          onPress={() => navigation.navigate('CreateKeys')}
          style={styles.returnButton}>
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

      {!!error && (
        <View style={styles.errorContainer}>
          <Text>{error}</Text>
        </View>
      )}

      {!isKeyboardVisible && (
        <View style={sharedMnemonicStyles.pagnationContainer}>
          <PaginationNavigator
            onPrevious={() => carousel.snapToPrev()}
            onNext={() => carousel.snapToNext()}
            onComplete={handleImportMnemonic}
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
