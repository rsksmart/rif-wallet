import React, { useMemo, useState } from 'react'
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

type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}
import { grid } from '../../../styles/grid'

import { Arrow } from '../../../components/icons'
import {
  SLIDER_HEIGHT,
  SLIDER_WIDTH,
  WINDOW_WIDTH,
} from '../../slides/Dimensions'
import { PaginationNavigator } from '../../../components/button/PaginationNavigator'
const slidesIndexes = [0, 1, 2, 3, 4, 5, 6, 7]
export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const mnemonicArray = mnemonic.split(' ')
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [carousel, setCarousel] = useState<any>()
  const word = ({ number, text }: { number: number; text: string }) => (
    <View style={styles.wordContainer}>
      <View style={styles.wordNumberBadgeContainer}>
        <View style={styles.wordNumberBadge}>
          <Text style={styles.wordNumberBadgeText}>{number} </Text>
        </View>
      </View>
      <View style={styles.wordTextContainer}>
        <Text style={styles.wordText}>{text}</Text>
      </View>
    </View>
  )
  const renderItem = ({ item }: { item: number }) => {
    const wordIndex = 3 * item
    return (
      <View style={styles.slideContainer}>
        {word({
          number: 1 + wordIndex,
          text: mnemonicArray[1 + wordIndex - 1],
        })}
        {word({
          number: 2 + wordIndex,
          text: mnemonicArray[2 + wordIndex - 1],
        })}
        {word({
          number: 3 + wordIndex,
          text: mnemonicArray[3 + wordIndex - 1],
        })}
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
          <Trans>Swipe to reveal next part of the phrase</Trans>
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
          onComplete={() =>
            navigation.navigate('ConfirmNewMasterKey', { mnemonic })
          }
          title="confirm"
          currentIndex={selectedSlide}
          slidesAmount={slidesIndexes.length}
          containerBackgroundColor={colors.darkBlue}
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
    marginBottom: 5,
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
  wordContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    fontWeight: 'bold',
    borderRadius: 10,
  },
  wordNumberBadgeContainer: {
    fontSize: 20,
  },
  wordNumberBadge: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 20,
  },
  wordNumberBadgeText: {
    textAlign: 'center',
    color: colors.white,
  },
  wordTextContainer: {
    color: colors.white,
    fontSize: 20,
  },
  wordText: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 10,
    paddingTop: 5,
  },
})
