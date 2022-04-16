import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native'
import { ScreenProps } from './types'
import { colors } from '../../styles/colors'
import { SecuritySlide } from '../slides/SecuritySlide'

import Carousel from 'react-native-snap-carousel'
import { grid } from '../../styles/grid'
import { PaginationNavigator } from '../../components/button/PaginationNavigator'
import { LogBox } from 'react-native'
import { Arrow } from '../../components/icons'
LogBox.ignoreLogs(['Warning: ...']) // Ignore log notification by message
LogBox.ignoreAllLogs() //Ignore all log notifications

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height
const SLIDER_WIDTH = Math.round(WINDOW_WIDTH * 0.7)
const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.75)
export const SecurityExplanationScreen: React.FC<
  ScreenProps<'SecurityExplanation'>
> = ({ navigation }) => {
  const [state, setState] = useState({ index: 0 })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [carousel, setCarousel] = useState<any>()
  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      default:
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
    }
  }

  return (
    <View style={styles.parent}>
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateKeys')}
        style={{ zIndex: 1 }}>
        <View
          style={{
            width: 30,
            height: 30,
            borderRadius: 30,
            margin: 15,
            backgroundColor: colors.purple,
            /*position: 'absolute',
            bottom: 100,*/
          }}>
          <Arrow color={colors.white} rotate={270} width={30} height={30} />
        </View>
      </TouchableOpacity>
      <View style={{ ...grid.row, ...styles.section, zIndex: 0 }}>
        <Carousel
          inactiveSlideOpacity={0}
          ref={c => setCarousel(c)}
          data={[0, 1, 2]}
          renderItem={renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={SLIDER_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          onSnapToItem={index => setState({ index })}
        />
      </View>

      <PaginationNavigator
        onPrevious={() => carousel.snapToPrev()}
        onNext={() => carousel.snapToNext()}
        title="confirm"
        currentIndex={state.index}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.blue,
    height: '100%',
    position: 'absolute',
  },
  sliderImage: {
    resizeMode: 'contain',
    width: WINDOW_WIDTH * 0.7,
    height: WINDOW_HEIGHT * 0.4,
  },
  section: {
    alignSelf: 'center',
    marginVertical: -55,
  },

  carouselContainer: {
    marginBottom: 0,
    paddingBottom: 0,
    height: SLIDER_HEIGHT,
  },
})
