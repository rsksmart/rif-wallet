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
import { Word } from './Word'

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const mnemonicArray = mnemonic.split(' ')
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [carousel, setCarousel] = useState<any>()

  const slidesIndexes = Array.from(
    { length: Math.ceil(mnemonicArray.length / 3) },
    (_, i) => i,
  )

  const renderItem = ({ item }: { item: number }) => {
    const wordIndex = 3 * item
    return (
      <View style={styles.slideContainer}>
        {Word({
          number: 1 + wordIndex,
          text: mnemonicArray[wordIndex],
        })}
        {Word({
          number: 2 + wordIndex,
          text: mnemonicArray[2 + wordIndex - 1],
        })}
        {Word({
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
})
