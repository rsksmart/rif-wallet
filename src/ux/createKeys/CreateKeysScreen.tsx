import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { ScreenProps } from './types'

import { grid } from '../../styles/grid'
import {
  OutlineButton,
  WhiteButton,
} from '../../components/button/ButtonVariations'
import { colors } from '../../styles/colors'

export const CreateKeysScreen: React.FC<ScreenProps<'CreateKeys'>> = ({
  navigation,
}) => {
  return (
    <ScrollView style={styles.parent}>
      <View style={{ ...grid.row, ...styles.center }}>
        <Image
          style={styles.tinyLogo}
          source={require('../../images/swallet-log.png')}
        />
      </View>
      <View style={{ ...grid.row, ...styles.center }}>
        <Text style={styles.header}>Welcome</Text>
      </View>
      <View style={{ ...grid.row, ...styles.center }}>
        <Text style={styles.subHeader}>to SWallet</Text>
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
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.darkBlue,
  },
  header: {
    color: colors.white,
    fontSize: 60,
    fontWeight: 'bold',
  },
  subHeader: {
    color: colors.white,
    fontSize: 60,
  },
  tinyLogo: {
    width: 200,
    resizeMode: 'contain',
  },
  center: {
    alignSelf: 'center',
  },
  row: {
    marginVertical: 10,
  },
})
