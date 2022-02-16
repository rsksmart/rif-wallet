import React from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Dimensions,
  Share,
  Text,
  TouchableOpacity,
} from 'react-native'
import QRCode from 'react-qr-code'
import Clipboard from '@react-native-community/clipboard'
import { CopyIcon } from '../../components/icons'
import { grid } from '../../styles/grid'
import { getTokenColor } from '../home/tokenColor'
import { ScreenWithWallet } from '../types'
import { getAddressDisplayText } from '../../components'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export type ReceiveScreenProps = {
  route: { params: { token: string | undefined } }
  registeredDomains: string[]
}

export type DefaultButtonProps = {
  onPress: () => void
  testID: string
}

export const DefaultButton: React.FC<DefaultButtonProps> = ({
  children,
  onPress,
  testID,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.75}
      testID={testID}
      style={styles.defaultButton}>
      {children}
    </TouchableOpacity>
  )
}

export const ReceiveScreen: React.FC<ScreenWithWallet & ReceiveScreenProps> = ({
  wallet,
  route,
  registeredDomains,
}) => {
  const smartAddress = wallet.smartWalletAddress
  const selectedToken = route.params?.token || 'TRBTC'

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.5

  const handleShare = () =>
    Share.share({
      title: smartAddress,
      message: smartAddress,
    })
  const handleCopy = () => Clipboard.setString(smartAddress)

  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 60)) / 2,
    width: qrCodeSize + 60,
  }

  return (
    <ScrollView style={styles.parent}>
      <View
        style={{ ...styles.qrContainer, ...qrContainerStyle }}
        testID={TestID.QRCodeDisplay}>
        <QRCode
          bgColor="#dbe3ff"
          color="#707070"
          value={smartAddress}
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
          {getAddressDisplayText(smartAddress).displayAddress}
        </Text>
        {registeredDomains.length > 0 &&
          registeredDomains.map((registeredDomain: string) => (
            <Text style={styles.smartAddress} key={registeredDomain}>
              <Text key={registeredDomain}>{registeredDomain}</Text>
            </Text>
          ))}
      </View>
      <View style={grid.row}>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <DefaultButton onPress={handleShare} testID={TestID.ShareButton}>
            <CopyIcon
              width={40}
              height={40}
              color={getTokenColor(selectedToken)}
            />
            <Text style={styles.defaultButtonText}>share</Text>
          </DefaultButton>
        </View>
        <View style={{ ...grid.column6, ...styles.bottomColumn }}>
          <DefaultButton onPress={handleCopy} testID={TestID.CopyButton}>
            <CopyIcon
              width={40}
              height={40}
              color={getTokenColor(selectedToken)}
            />
            <Text style={styles.defaultButtonText}>copy</Text>
          </DefaultButton>
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
    alignItems: 'center',
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
  defaultButtonText: {
    color: '#FFFFFF',
  },
})
