import React, { useState } from 'react'
import { Image, StyleSheet, View } from 'react-native'

import Carousel, { Pagination } from 'react-native-snap-carousel'

import { name as appName } from 'src/../app.json'
import { OutlineButton } from 'src/components/button/OutlineButton'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { CreateKeysScreenProps } from 'src/navigation/createKeysNavigator'
import { colors, grid } from 'src/styles'
import {
  SLIDER_WIDTH,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from 'src/ux/slides/Dimensions'
import { MainSlide } from 'src/ux/slides/MainSlide'
import { SecondarySlide } from 'src/ux/slides/SecondarySlide'

const slidesIndexes = [0, 1, 2]
export const CreateKeysScreen: React.FC<
  CreateKeysScreenProps<'CreateKeys'>
> = ({ navigation }) => {
  const [selectedSlide, setSelectedSlide] = useState<number>(0)

  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      case 0:
        return MainSlide({
          title: 'Welcome to',
          subTitle: appName,
          image: (
            <Image
              style={styles.walletBulbLogo}
              source={require('src/images/wallet.png')}
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
              source={require('src/images/wallet_bulb.png')}
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
              source={require('src/images/bulb.png')}
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
        <PrimaryButton
          onPress={() => navigation.navigate('SecureYourWallet')}
          accessibilityLabel="newWallet"
          title={'new wallet'}
          style={styles.newWalletButton}
        />
      </View>
      <View style={{ ...grid.row, ...styles.section }}>
        <OutlineButton
          onPress={() => navigation.navigate('ImportMasterKey')}
          accessibilityLabel="importWallet"
          title={'import wallet'}
          style={styles.importWalletButton}
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
  paginationContainer: {
    backgroundColor: colors.blue,
  },
  dotStyle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
  },
  newWalletButton: {
    width: 150,
    borderWidth: 1,
    borderColor: colors.lightPurple,
  },
  importWalletButton: {
    width: 150,
  },
})
