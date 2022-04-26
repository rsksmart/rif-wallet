import React, { useState } from 'react'
import { StyleSheet, View, Image, TouchableOpacity, Text } from 'react-native'
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

import {
  WINDOW_WIDTH,
  WINDOW_HEIGHT,
  SLIDER_WIDTH,
  SLIDER_HEIGHT,
} from '../slides/Dimensions'
import {
  BlueButton,
  OutlineButton,
  WhiteButton,
} from '../../components/button/ButtonVariations'
import { DialButton } from '../../components/button/DialButton'
import { TokenButton } from '../../components/button/TokenButton'
import { Button } from '../../components'
import { ButtonAlt } from '../../components/button/ButtonAlt'

export const SecureYourWalletScreen: React.FC<ScreenProps<'SecureYourWallet'>> =
  ({ navigation }) => {
    return (
      <View style={styles.parent}>
        <TouchableOpacity onPress={() => navigation.navigate('CreateKeys')}>
          <View style={styles.returnButtonView}>
            <Arrow color={colors.white} rotate={270} width={30} height={30} />
          </View>
        </TouchableOpacity>
        <View style={styles.itemContainer}>
          <Image
            style={styles.walletBulbLogo}
            source={require('../../images/safe.png')}
          />
          <View style={{ ...grid.row, ...styles.center }}>
            <Text style={styles.title}>Secure your wallet</Text>
          </View>
          <View style={{ ...grid.row, ...styles.center }}>
            <Text style={styles.subTitle}>Before you create your wallet, we advise you to generate and store your <Text style={styles.bold}>unique Master Key</Text></Text>
          </View>
          <View style={{ ...grid.row, ...styles.center }}>
            <Text style={styles.subTitle}>This key will help you restore your wallet and access your funds on a new devise, in case the old one was lost or stolen</Text>
          </View>
        </View>
        <View style={{ ...grid.row, ...styles.section }}>
          <BlueButton
            onPress={() => navigation.navigate('SecurityExplanation')}
            testID="Address.ShareButton"
            title={'secure now'}
          />
        </View>
        <View style={{ ...grid.row, ...styles.section }}>
          <WhiteButton
            onPress={() => console.log('TODO in different PR')}
            testID="Address.ShareButton"
            title={'secure later'}
          />
        </View>
      </View>
    )
  }

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.lightPurple,
    height: '100%',
  },
  returnButtonView: {
    width: 30,
    height: 30,
    borderRadius: 30,
    margin: 15,
    backgroundColor: colors.blue,
  },

  title: {
    color: colors.black,
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  subTitle: {
    color: colors.black,
    fontSize: 16,
    marginHorizontal: 45,
    marginVertical: 10,
  },

  center: {
    alignSelf: 'center',
  },

  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.lightPurple,
    marginBottom: 20,
  },

  walletBulbLogo: {
    resizeMode: 'contain',
    height: Math.round(WINDOW_HEIGHT * 0.3),
    marginBottom: 10,
  },
  section: {
    alignSelf: 'center',
    marginVertical: 10,
  },
})
