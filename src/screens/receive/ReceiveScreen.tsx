import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Dimensions, Share } from 'react-native'
import QRCode from 'react-qr-code'

import { Button, CopyComponent } from '../../components'


import { shortAddress } from '../../lib/utils'
import { RIFWallet } from '../../lib/core/RIFWallet'
import { useSelectedWallet } from '../../Context'

import { ScreenProps } from '../../RootNavigation'

// TODO: accountLink is hardcoded until we had the rns sdk
const accountLink = 'ilan.rsk'
const window = Dimensions.get('window')

const useShare = (title: string, textToShare: string) => {
  const [isSharing, setIsSharing] = useState(false)

  const handleShare = async () => {
    setIsSharing(true)

    try {
      await Share.share({
        title: title,
        message: textToShare,
      })
    } catch (error) {
      console.error('useShare', error)
    }

    setTimeout(() => {
      setIsSharing(false)
    }, 2000)
  }

  return {
    isSharing,
    handleShare,
  }
}

/**
 * TODO: refactor QR and share components
 */

export const ReceiveScreen = () => {
  const account = useSelectedWallet()

  const smartAddress = account.smartWalletAddress
  const { isSharing, handleShare } = useShare('Account', smartAddress)

  return (
    <ScrollView>
      <View style={styles.section}>
        {smartAddress !== '' && (
          <QRCode
            bgColor="transparent"
            value={smartAddress}
            size={window.width * 0.6}
          />
        )}
      </View>

      <CopyComponent value={accountLink} testID={'Copy.Mnemonic'} />
      <CopyComponent prefix='Smart address: ' value={smartAddress} testID={'Copy.Mnemonic'} />

      <View style={styles.section}>
        <Button
          onPress={() => {
            handleShare()
          }}
          title={isSharing ? 'shared!' : 'share'}
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
