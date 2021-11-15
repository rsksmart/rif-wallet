import React from 'react'
import { StyleSheet, View, ScrollView, Dimensions, Share } from 'react-native'
import QRCode from 'react-qr-code'

import { Address, Button, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
}

export const ReceiveScreen: React.FC<ScreenWithWallet> = ({ wallet }) => {
  const smartAddress = wallet.address

  const handleShare = () =>
    Share.share({
      title: smartAddress,
      message: smartAddress,
    })

  return (
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
  )
}

const styles = StyleSheet.create({
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
