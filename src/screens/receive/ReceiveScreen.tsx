import React from 'react'
import { StyleSheet, View, ScrollView, Dimensions, Share } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import QRCode from 'react-qr-code'

import { Address, Button, Paragraph } from '../../components'
import { getTokenColorWithOpacity } from '../home/tokenColor'
import { ScreenWithWallet } from '../types'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
}

type ReceiveScreenProps = {
  route: any
}

export const ReceiveScreen: React.FC<ScreenWithWallet & ReceiveScreenProps> = ({
  wallet,
  route,
}) => {
  const smartAddress = wallet.smartWalletAddress
  const selectedToken = route.params?.token || 'TRBTC'

  console.log({ selectedToken })

  const handleShare = () =>
    Share.share({
      title: smartAddress,
      message: smartAddress,
    })

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedToken, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <View style={styles.section} testID={TestID.QRCodeDisplay}>
          <QRCode
            bgColor="transparent"
            value={smartAddress}
            size={Dimensions.get('window').width * 0.6}
          />
        </View>

        <Paragraph>
          Smart address:{' '}
          <Address testID={TestID.AddressText}>{smartAddress}</Address>
        </Paragraph>

        <View style={styles.section}>
          <Button
            onPress={() => {
              handleShare()
            }}
            title="Share"
            testID={TestID.ShareButton}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
  section2: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
})
