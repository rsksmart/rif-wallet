import React, { useState } from 'react'
import { Dimensions, StyleSheet, View, ScrollView, Text } from 'react-native'
import QRCode from 'react-qr-code'
import { getAddressDisplayText } from '../../components'
import { ShareableText } from '../../components/ShareableText'
import { Tabs } from '../../components/Tabs'
import { colors } from '../../styles/colors'

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
  const [activeTab, setActiveTab] = useState('address')

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.5

  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 60)) / 2,
    width: qrCodeSize + 60,
  }

  const handleTabSelection = (selectedTab: string) => {
    setActiveTab(selectedTab)
  }
  return (
    <ScrollView style={styles.parent}>
      <View style={qrContainerStyle}>
        <Text style={styles.title}>share QR Code</Text>
      </View>
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
      <View style={{ ...qrContainerStyle }}>
        <Tabs
          title={'share details'}
          tabs={['address', 'domains']}
          selectedTab={activeTab}
          onTabSelected={handleTabSelection}
        />
      </View>
      {activeTab === 'address' && (
        <View style={qrContainerStyle}>
          <ShareableText
            text={getAddressDisplayText(smartWalletAddress).displayAddress}
            valueToShare={smartWalletAddress}
          />
        </View>
      )}

      {activeTab === 'domains' && (
        <View style={qrContainerStyle}>
          {registeredDomains.map((domain, index) => (
            <ShareableText key={index} text={domain} valueToShare={domain} />
          ))}
          {registeredDomains?.length === 0 && (
            <Text style={styles.noDomainsText}>Domains not found</Text>
          )}
        </View>
      )}
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
  title: {
    color: colors.white,
  },
  qrContainer: {
    backgroundColor: '#dbe3ff',
    marginVertical: 20,
    padding: 30,
    borderRadius: 20,
  },
  noDomainsText: {
    alignSelf: 'center',
    color: colors.white,
  },
})
