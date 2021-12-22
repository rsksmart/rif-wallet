import React from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
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
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedToken, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <Text style={styles.header}>Set up your Wallet</Text>
        <View style={styles.container}>
          <Image
            style={styles.tinyLogo}
            source={{
              uri: 'https://cdn2.iconfinder.com/data/icons/30px-bank/30/17_wallet-money-cashback-transfer-account-balance-1024.png',
            }}
          />
        </View>

        <View style={grid.row}>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              // @ts-ignore
              onPress={() => navigation.navigate('ImportMasterKey')}
              title="Import"
              testID="Address.ShareButton"
              icon={<ImportWalletIcon color={getTokenColor(selectedToken)} />}
            />
          </View>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              // @ts-ignore
              onPress={() => navigation.navigate('NewMasterKey')}
              title="New Wallet"
              testID="Address.CopyButton"
              icon={
                <NewWalletIcon
                  width={55}
                  height={55}
                  color={getTokenColor(selectedToken)}
                />
              }
            />
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
  qrContainer: {
    backgroundColor: 'rgba(255, 255, 255, .7)',
    marginVertical: 20,
    padding: 20,
    borderRadius: 20,
  },
  addressContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .7)',
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
