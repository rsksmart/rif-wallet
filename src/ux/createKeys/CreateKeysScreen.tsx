import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native'
import { ScreenProps } from './types'
import LinearGradient from 'react-native-linear-gradient'

import {
  getTokenColor,
  getTokenColorWithOpacity,
} from '../../screens/home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { ImportWalletIcon, NewWalletIcon } from '../../components/icons'

export const CreateKeysScreen: React.FC<ScreenProps<'CreateKeys'>> = ({
  navigation,
  route,
}) => {
  // @ts-ignore
  const selectedToken = route.params?.token || 'TRBTC'
  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Set up your Wallet</Text>
      <View style={styles.container}>
        <Image source={require('../../images/onbording-logo.png')} />
      </View>

      <View style={grid.row}>
        <View
          style={{
            ...grid.column12,
            ...styles.bottomColumn,
          }}>
          <Text>Welcome to swallet</Text>
        </View>
      </View>

      <View style={grid.row}>
        <View
          style={{
            ...grid.column12,
            ...styles.bottomColumn,
          }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('NewMasterKey')}
            activeOpacity={0.75}
            style={styles.defaultButton}>
            <Text>Create New Wallet</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('ImportMasterKey')}
            activeOpacity={0.75}
            style={styles.defaultButton}>
            <Text>Import Existing Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('ReEnterKey')}
            activeOpacity={0.75}
            style={styles.defaultButton}>
            <Text>Re Enter Wallet</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#050134',
    height: '100%',
    opacity: 0.9,
    paddingTop: 40,
  },

  defaultButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    borderRadius: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: '#dbe3ff',
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
  },
  smartAddress: {
    color: '#5C5D5D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  smartAddressLabel: {
    color: '#5C5D5D',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  bottomColumn: {
    alignItems: 'center',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tinyLogo: {
    padding: 20,
    width: 200,
    height: 200,
  },
})
