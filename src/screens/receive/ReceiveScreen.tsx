import React from 'react'
import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  Share,
  Text,
} from 'react-native'
import { BaseButton } from '../../components/button/BaseButton'
import QRCode from 'react-qr-code'
import Clipboard from '@react-native-community/clipboard'
import { CopyIcon, ShareIcon } from '../../components/icons'
import { grid } from '../../styles/grid'
import { getAddressDisplayText } from '../../components'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export type ReceiveScreenProps = {
  registeredDomains: string[]
  smartWalletAddress: string
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
  smartWalletAddress,
  registeredDomains,
}) => {
  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.5

  const handleShare = () =>
    Share.share({
      title: smartWalletAddress,
      message: smartWalletAddress,
    })
  const handleCopy = () => Clipboard.setString(smartWalletAddress)

  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 60)) / 2,
    width: qrCodeSize + 60,
  }

  const hasRegisteredDomains = registeredDomains.length > 0

  return (
    <ScrollView style={styles.parent}>
      <View
        style={{ ...styles.qrContainer, ...qrContainerStyle }}
        testID={TestID.QRCodeDisplay}>
        <QRCode
          bgColor="#dbe3ff"
          color="#707070"
          value={smartWalletAddress}
          size={qrCodeSize}
        />
      </View>
      <View>
        <Text style={{ ...qrContainerStyle, ...styles.smartAddressLabel }}>
          smart address
        </Text>
      </View>
      <View style={{ ...styles.addressContainer, ...qrContainerStyle }}>
        <Text testID={TestID.AddressText} style={styles.smartAddress}>
          {getAddressDisplayText(smartWalletAddress).displayAddress}
        </Text>
        {hasRegisteredDomains &&
          registeredDomains.map((registeredDomain: string) => (
            <Text style={styles.smartAddress} key={registeredDomain}>
              <Text key={registeredDomain}>{registeredDomain}</Text>
            </Text>
          ))}
      </View>
      <View style={{ ...grid.row, ...qrContainerStyle, ...styles.customRow }}>
        <View
          style={{
            ...grid.column5,
            ...styles.bottomColumn,
          }}>
          <BaseButton onPress={handleShare} testID={TestID.ShareButton}>
            <ShareIcon width={30} height={30} />
            <Text style={styles.buttonText}>share</Text>
          </BaseButton>
        </View>
        <View style={{ ...grid.column5, ...styles.bottomColumn }}>
          <BaseButton onPress={handleCopy} testID={TestID.CopyButton}>
            <CopyIcon width={30} height={30} />
            <Text style={styles.buttonText}>copy</Text>
          </BaseButton>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: '#050134',
    height: '100%',
    opacity: 0.9,
    paddingTop: 40,
  },
  qrContainer: {
    backgroundColor: '#dbe3ff',
    marginVertical: 20,
    padding: 30,
    borderRadius: 20,
  },
  addressContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#dbe3ff',
  },
  smartAddress: {
    color: '#08043c',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  smartAddressLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
    textAlign: 'left',
    marginTop: 5,
    marginBottom: 5,
  },
  bottomColumn: {
    marginVertical: 20,
  },
  customRow: { justifyContent: 'space-between' },
  buttonText: {
    color: '#FFFFFF',
  },
})
