import { useState } from 'react'
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native'
import Carousel from 'react-native-snap-carousel'

import {
  createKeysRouteNames,
  CreateKeysScreenProps,
} from 'navigation/createKeysNavigator/types'
import { SecuritySlide } from '../../ux/slides/SecuritySlide'
import { PaginationNavigator } from 'components/button/PaginationNavigator'
import { Arrow } from 'components/icons'
import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SLIDER_WIDTH,
  SLIDER_HEIGHT,
} from '../../ux/slides/Dimensions'
import { colors } from '../../styles'
import { sharedMnemonicStyles } from './new/styles'
import { CompositeScreenProps } from '@react-navigation/native'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'src/navigation/rootNavigator'

const slidesIndexes = [0, 1, 2]

type Props = CompositeScreenProps<
  CreateKeysScreenProps<createKeysRouteNames.SecurityExplanation>,
  RootStackScreenProps<rootStackRouteNames.CreateKeysUX>
>

export const SecurityExplanationScreen = ({ navigation }: Props) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [carousel, setCarousel] = useState<Carousel<number>>()

  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      case 0:
        return SecuritySlide({
          title: 'How to store your key?',
          description:
            'The safest method to store the key is to write down on a piece of paper and place it on a secure location',
          description2:
            'Make a copy, hide too... but never save it in the cloud or make screenshots',
          image: (
            <Image
              style={styles.sliderImage}
              source={require('../../images/slides/shield.png')}
            />
          ) as unknown as Image,
        })
      case 1:
        return SecuritySlide({
          title: 'Why is it so important?',
          description:
            'You are the only owner of your key. We do not keep any copy of it, and that is why you need to store your key very safely',
          description2:
            'We will not be able to recover it for you in case you lose it.',
          image: (
            <Image
              style={styles.sliderImage}
              source={require('../../images/slides/key.png')}
            />
          ) as unknown as Image,
        })
      case 2:
        return SecuritySlide({
          title: 'Lets get started!',
          description:
            'Your Master Key will be generated in the next step as a 24-word phrase. We know it is a lot, but it is for your security!',
          description2:
            'Key will be revealed step by step. Write it down carefully.',
          image: (
            <Image
              style={styles.sliderImage}
              source={require('../../images/slides/papers.png')}
            />
          ) as unknown as Image,
        })
      default:
        return null
    }
  }

  return (
    <ScrollView style={sharedMnemonicStyles.purpleParent}>
      <View style={sharedMnemonicStyles.topContent}>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateKeys')}
          style={styles.returnButton}
          accessibilityLabel="backButton">
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
      </View>
      <View style={sharedMnemonicStyles.sliderContainer}>
        <Carousel
          inactiveSlideOpacity={0}
          removeClippedSubviews={false} //https://github.com/meliorence/react-native-snap-carousel/issues/238
          ref={c => c && setCarousel(c)}
          data={slidesIndexes}
          renderItem={renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={SLIDER_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          onSnapToItem={index => setSelectedSlide(index)}
        />
      </View>
      <View style={sharedMnemonicStyles.pagnationContainer}>
        <PaginationNavigator
          onPrevious={() => carousel?.snapToPrev()}
          onNext={() => carousel?.snapToNext()}
          onComplete={() => navigation.navigate('NewMasterKey')}
          title="confirm"
          currentIndex={selectedSlide}
          slidesAmount={slidesIndexes.length}
        />
      </View>
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
  sliderImage: {
    resizeMode: 'contain',
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_HEIGHT * 0.3,
  },

  carouselContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    height: SLIDER_HEIGHT,
  },
})
