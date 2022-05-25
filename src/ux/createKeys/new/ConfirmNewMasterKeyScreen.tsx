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

import { grid } from '../../../styles/grid'

import { Arrow } from '../../../components/icons'
import {
  SLIDER_HEIGHT,
  SLIDER_WIDTH,
  WINDOW_WIDTH,
} from '../../slides/Dimensions'
import { PaginationNavigator } from '../../../components/button/PaginationNavigator'
import { WordSelector } from './WordSelector'

const slidesIndexes = Array.from({ length: 8 }, (_, i) => i) //[0, 1, 2, 3, 4, 5, 6, 7]
interface ConfirmMasterKeyScreenProps {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ConfirmNewMasterKeyScreen: React.FC<
  ScreenProps<'ConfirmNewMasterKey'> & ConfirmMasterKeyScreenProps
> = ({ route, navigation, createFirstWallet }) => {
  const mnemonic = route.params.mnemonic

  const mnemonicWords = mnemonic.split(' ')

  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [carousel, setCarousel] = useState<any>()

  const handleConfirmMnemonic = async () => {
    await createFirstWallet(mnemonic)
  }

  const handleWordSelected = async (wordSelected: string, index: number) => {
    const newSelectedWords = [...selectedWords]
    newSelectedWords[index] = wordSelected
    setSelectedWords(newSelectedWords)
  }

  const renderItem: React.FC<{ item: number }> = ({ item }) => {
    const groupIndex = 3 * item
    return (
      <View>
        <WordSelector
          wordIndex={groupIndex}
          words={mnemonicWords}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={2 + groupIndex - 1}
          words={mnemonicWords}
          onWordSelected={handleWordSelected}
        />
        <WordSelector
          wordIndex={3 + groupIndex - 1}
          words={mnemonicWords}
          onWordSelected={handleWordSelected}
        />
      </View>
    )
  }

  return (
    <>
      <ScrollView style={styles.parent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateKeys')}
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

        <View style={{ ...grid.row, ...styles.carouselSection }}>
          <Carousel
            inactiveSlideOpacity={0}
            removeClippedSubviews={false} //https://github.com/meliorence/react-native-snap-carousel/issues/238
            ref={c => setCarousel(c)}
            data={slidesIndexes}
            renderItem={renderItem}
            sliderWidth={WINDOW_WIDTH}
            itemWidth={SLIDER_WIDTH}
            containerCustomStyle={styles.carouselContainer}
            inactiveSlideShift={0}
            onSnapToItem={index => setSelectedSlide(index)}
          />
        </View>

        <PaginationNavigator
          onPrevious={() => carousel.snapToPrev()}
          onNext={() => carousel.snapToNext()}
          onComplete={handleConfirmMnemonic}
          title="confirm"
          currentIndex={selectedSlide}
          slidesAmount={slidesIndexes.length}
          containerBackgroundColor={colors.darkBlue}
          completed={selectedWords.join() === mnemonicWords.join()}
        />
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.darkBlue,
  },
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
  carouselSection: {
    alignSelf: 'center',
  },

  carouselContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    height: SLIDER_HEIGHT,
  },

  slideContainer: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginTop: 60,
    height: 250,
  },
})
