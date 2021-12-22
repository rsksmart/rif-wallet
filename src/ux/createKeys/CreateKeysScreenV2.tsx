import React from 'react'
import { StyleSheet, View, ScrollView, Dimensions, Text } from 'react-native'
import { Button, Paragraph } from '../../components'
import { ScreenProps } from './types'
import LinearGradient from 'react-native-linear-gradient'

import {
  getTokenColor,
  getTokenColorWithOpacity,
} from '../../screens/home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, CopyIcon } from '../../components/icons'
import { TestID } from '../../screens/receive/ReceiveScreen'

export const CreateKeysScreenV2: React.FC<ScreenProps<'CreateKeys'>> = ({
  navigation,
  route,
}) => {
  const selectedToken = route.params?.token || 'TRBTC'
  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6
  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 20)) / 2,
    width: qrCodeSize + 40,
  }
  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedToken, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <Text style={styles.header}>Setup your Wallet</Text>
        <View
          style={{ ...styles.qrContainer, ...qrContainerStyle }}
          testID={TestID.QRCodeDisplay}>
          {/*<QRCode
            bgColor="#ffffff"
            color="#707070"
            value={smartAddress}
            size={qrCodeSize}
          />*/}
        </View>

        <View style={grid.row}>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              onPress={() => navigation.navigate('ImportMasterKey')}
              title="Import"
              testID="Address.ShareButton"
              icon={<Arrow color={getTokenColor(selectedToken)} rotate={225} />}
            />
          </View>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              onPress={() => navigation.navigate('NewMasterKey')}
              title="New Wallet"
              testID="Address.CopyButton"
              icon={
                <CopyIcon
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
})
