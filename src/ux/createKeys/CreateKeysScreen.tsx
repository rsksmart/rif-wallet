import React, { useState } from 'react'
import { StyleSheet, View, Text, Dimensions, Image } from 'react-native'
import { ScreenProps } from './types'
import { colors } from '../../styles/colors'

import Carousel, { Pagination } from 'react-native-snap-carousel'
import { grid } from '../../styles/grid'
import {
  OutlineButton,
  WhiteButton,
} from '../../components/button/ButtonVariations'

const WINDOW_WIDTH = Dimensions.get('window').width
const WINDOW_HEIGHT = Dimensions.get('window').height
const ITEM_WIDTH = Math.round(WINDOW_WIDTH * 0.7)
const ITEM_HEIGHT = Math.round(WINDOW_HEIGHT * 0.5)

const welcomeSlide = () => (
  <View style={styles.itemContainer}>
    <Image
      style={styles.walletLogo}
      source={require('../../images/wallet.png')}
    />
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.header}>Welcome</Text>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.subHeader}>to SWallet</Text>
    </View>
  </View>
)

const newFeaturesSlide = () => (
  <View style={styles.itemContainer}>
    <Image
      style={styles.walletBulbLogo}
      source={require('../../images/wallet_bulb.png')}
    />
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.subSubMainHeader}>Bringing new features</Text>
    </View>
    <View style={{ ...grid.row, ...styles.center }}>
      <Text style={styles.subSubHeader}>
        Lorem ipsum dolor sit amet consectetur adipiscing elit
      </Text>
    </View>
  </View>
)

export const CreateKeysScreen: React.FC<ScreenProps<'CreateKeys'>> = ({
  navigation,
}) => {
  const [state, setState] = useState({ index: 0 })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [carousel, setCarousel] = useState<any>()
  const renderItem = ({ item }: { item: number }) => {
    switch (item) {
      case 0:
        return welcomeSlide()
      case 1:
        return newFeaturesSlide()
      default:
        return welcomeSlide()
    }
  }

  const pagination = () => {
    const entries = [0, 1]
    const activeSlide = state.index
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
      <View style={{ ...grid.row, ...styles.center, ...styles.row }}>
        <Carousel
          inactiveSlideOpacity={0}
          ref={c => setCarousel(c)}
          data={[0, 1]}
          renderItem={renderItem}
          sliderWidth={WINDOW_WIDTH}
          itemWidth={ITEM_WIDTH}
          containerCustomStyle={styles.carouselContainer}
          inactiveSlideShift={0}
          onSnapToItem={index => setState({ index })}
        />
      </View>
      <View style={{ ...grid.row, ...styles.center, ...styles.row }}>
        {pagination()}
      </View>
      <View style={{ ...grid.row, ...styles.center, ...styles.row }}>
        <WhiteButton
          onPress={() => navigation.navigate('ImportMasterKey')}
          testID="Address.ShareButton"
          title={'Import existing wallet'}
        />
      </View>
      <View style={{ ...grid.row, ...styles.center, ...styles.row }}>
        <OutlineButton
          onPress={() => navigation.navigate('NewMasterKey')}
          testID="Address.ShareButton"
          title={'Create a new wallet'}
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
  header: {
    color: colors.white,
    fontSize: 40,
    fontWeight: 'bold',
  },
  subHeader: {
    color: colors.white,
    fontSize: 40,
  },
  subSubMainHeader: {
    color: colors.white,
    fontSize: 20,
    fontWeight: 'bold',
    paddingBottom: 10,
  },
  subSubHeader: {
    color: colors.white,
    fontSize: 19,
  },
  walletLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.3),
  },

  walletBulbLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.3),
  },
  center: {
    alignSelf: 'center',
  },
  row: {
    marginVertical: 10,
  },
  carouselContainer: {
    marginTop: 5,
    marginBottom: 0,
    paddingBottom: 0,
  },
  itemContainer: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blue,
  },
  itemLabel: {
    color: 'white',
    fontSize: 24,
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
