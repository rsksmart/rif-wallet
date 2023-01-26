import React, { useState } from 'react'
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native'
import QRCode from 'react-qr-code'
import { RegularText } from 'src/components'
import { ToggleButtons } from '../../components/button/ToggleButtons'
import { ShareableText } from '../../components/ShareableText'
import { colors } from '../../styles/colors'

export enum TestID {
  QRCodeDisplay = 'Address.QRCode',
  AddressText = 'Address.AddressText',
  ShareButton = 'Address.ShareButton',
  CopyButton = 'Address.CopyButton',
}

export type ReceiveScreenProps = {
  registeredDomains: string[]
  address: string
  displayAddress: string
}

export const ReceiveScreen: React.FC<ReceiveScreenProps> = ({
  registeredDomains,
  address,
  displayAddress,
}) => {
  const [activeTab, setActiveTab] = useState('address')

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.5

  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 60)) / 2,
    width: qrCodeSize + 60,
    marginTop: 10,
  }

  const handleOptionSelected = (selectedTab: string) => {
    setActiveTab(selectedTab)
  }

  return (
    <ScrollView style={styles.parent}>
      <View style={qrContainerStyle}>
        <RegularText style={styles.title}>share QR Code</RegularText>
      </View>
      <View
        style={{ ...styles.qrContainer, ...qrContainerStyle }}
        testID={TestID.QRCodeDisplay}>
        <QRCode
          bgColor="#dbe3ff"
          color="#707070"
          value={address}
          size={qrCodeSize}
        />
      </View>
      <View style={qrContainerStyle}>
        <ToggleButtons
          label={'share details'}
          options={['address', 'domains']}
          selectedOption={activeTab}
          onOptionSelected={handleOptionSelected}
        />
      </View>
      {activeTab === 'address' && (
        <View style={qrContainerStyle}>
          <ShareableText text={displayAddress} valueToShare={address} />
        </View>
      )}

      {activeTab === 'domains' && (
        <View style={qrContainerStyle}>
          {registeredDomains.map((domain, index) => (
            <ShareableText key={index} text={domain} valueToShare={domain} />
          ))}
          {registeredDomains?.length === 0 && (
            <RegularText style={styles.noDomainsText}>
              Domains not found
            </RegularText>
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
