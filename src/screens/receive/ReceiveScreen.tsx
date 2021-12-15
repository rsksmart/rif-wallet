import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Share,
  Text,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import QRCode from 'react-qr-code'
import Clipboard from '@react-native-community/clipboard'

import { SquareButton } from '../../components/button/SquareButton'
import { CopyIcon } from '../../components/icons/CopyIcon'
import { grid } from '../../styles/grid'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { ScreenWithWallet } from '../types'
import { ArrowDown } from '../../components/icons/ArrowDown'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
}

type ReceiveScreenProps = {
  route: { params: { token: string | undefined } }
}

export const ReceiveScreen: React.FC<ScreenWithWallet & ReceiveScreenProps> = ({
  wallet,
  route,
}) => {
  const smartAddress = wallet.smartWalletAddress
  const selectedToken = route.params?.token || 'TRBTC'

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6

  const handleShare = () =>
    Share.share({
      title: smartAddress,
      message: smartAddress,
    })

  const handleCopy = () => Clipboard.setString(smartAddress)

  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 20)) / 2,
    width: qrCodeSize + 40,
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedToken, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <Text style={styles.header}>Receive</Text>
        <View
          style={{ ...styles.qrContainer, ...qrContainerStyle }}
          testID={TestID.QRCodeDisplay}>
          <QRCode
            bgColor="#ffffff"
            color="#707070"
            value={smartAddress}
            size={qrCodeSize}
          />
        </View>

        <View style={{ ...styles.addressContainer, ...qrContainerStyle }}>
          <Text testID={TestID.AddressText} style={styles.smartAddress}>
            {smartAddress.substr(0, 16)}...
            {smartAddress.substr(smartAddress.length - 4, smartAddress.length)}
          </Text>
        </View>
        <Text style={styles.smartAddressLabel}>smart address</Text>

        <View style={grid.row}>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              onPress={handleShare}
              title="share"
              testID="Address.ShareButton"
              icon={<ArrowDown color={getTokenColor(selectedToken)} />}
            />
          </View>
          <View style={{ ...grid.column6, ...styles.bottomColumn }}>
            <SquareButton
              onPress={handleCopy}
              title="copy"
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
