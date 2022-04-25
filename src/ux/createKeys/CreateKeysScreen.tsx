import React, { useState } from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { ScreenProps } from './types'
import { colors } from '../../styles/colors'
import { SecondarySlide } from '../slides/SeconderySlide'
import { MainSlide } from '../slides/MainSlide'

import Carousel, { Pagination } from 'react-native-snap-carousel'
import { grid } from '../../styles/grid'
import {
  OutlineButton,
  WhiteButton,
} from '../../components/button/ButtonVariations'

import { WINDOW_WIDTH, WINDOW_HEIGHT, SLIDER_WIDTH } from '../slides/Dimensions'

const slidesIndexes = [0, 1, 2]
export const CreateKeysScreen: React.FC<ScreenProps<'CreateKeys'>> = ({
  navigation,
}) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0)
  const [carousel, setCarousel] = useState<any>()

  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      case 0:
        return MainSlide({
          title: 'Welcome to',
          subTitle: 'RSK Wallet',
          image: (
            <Image
              style={styles.walletBulbLogo}
              source={require('../../images/wallet.png')}
            />
          ) as unknown as Image,
        })
      case 1:
        return SecondarySlide({
          title: 'Bringing new features',
          description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
          image: (
            <Image
              style={styles.walletBulbLogo}
              source={require('../../images/wallet_bulb.png')}
            />
          ) as unknown as Image,
        })
      case 2:
        return SecondarySlide({
          title: 'Fee for deployment',
          description: 'Lorem ipsum dolor sit amet',
          image: (
            <Image
              style={styles.bulbLogo}
              source={require('../../images/bulb.png')}
            />
          ) as unknown as Image,
        })
    }
  }

  const pagination = (entries: number[]) => {
    const activeSlide = selectedSlide
    return (
      <Pagination
        dotsLength={entries.length}
        activeDotIndex={activeSlide}
        containerStyle={styles.paginationContainer}
        dotStyle={styles.dotStyle}
        inactiveDotStyle={{}}
        inactiveDotOpacity={0.4}
        inactiveDotScale={0.6}
      />
    )
  }

  return (
    <View style={styles.parent}>
      <View style={{ ...grid.row, ...styles.section }}>
        <Carousel
          inactiveSlideOpacity={0}
          data={slidesIndexes}
          renderItem={renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={SLIDER_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          onSnapToItem={index => setSelectedSlide(index)}
        />
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        {pagination(slidesIndexes)}
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <WhiteButton
          onPress={() => navigation.navigate('SecurityExplanation')}
          testID="Address.ShareButton"
          title={'new wallet'}
        />
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <OutlineButton
          onPress={() => navigation.navigate('ImportMasterKey')}
          testID="Address.ShareButton"
          title={'import  wallet'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.blue,
    height: '100%',
  },

  walletLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.3),
  },

  walletBulbLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.3),
  },
  bulbLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.25),
    marginBottom: 30,
  },
  section: {
    alignSelf: 'center',
    marginVertical: 10,
  },

  carouselContainer: {
    marginTop: 5,
    marginBottom: 0,
    paddingBottom: 0,
  },

  paginationContainer: { backgroundColor: colors.blue },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
})
