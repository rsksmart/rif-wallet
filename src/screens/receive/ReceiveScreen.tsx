import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Dimensions, Share } from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'

import QRCode from 'react-qr-code'

import { shortAddress } from '../../lib/utils'
import { RIFWallet } from '../../lib/core/RIFWallet'
import { useSelectedWallet } from '../../Context'

import { ScreenProps } from '../../RootNavigation'

// TODO: accountLink is hardcoded until we had the rns sdk
const accountLink = 'ilan.rsk'
const window = Dimensions.get('window')

const useCopy = (textToCopy: string) => {
  const [isCopying, setIsCopying] = useState(false)

  const handleCopy = () => {
    setIsCopying(true)

    Clipboard.setString(textToCopy)

    setTimeout(() => {
      setIsCopying(false)
    }, 2000)
  }

  return {
    isCopying,
    handleCopy,
  }
}

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

const ReceiveScreen= () => {
  const account = useSelectedWallet()

  const smartAddress = account.smartWalletAddress
  const { isCopying: isCopyingAccount, handleCopy: handleCopyAccount } =
    useCopy(smartAddress)
  const { isCopying: isCopyingAccountLink, handleCopy: handleCopyAccountLink } =
    useCopy(accountLink)
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

      <View style={styles.section2}>
        <Paragraph>{accountLink} </Paragraph>
        <Button
          disabled={isCopyingAccountLink}
          onPress={handleCopyAccountLink}
          title={isCopyingAccountLink ? 'copied!' : 'copy'}
        />
      </View>
      <View style={styles.section2}>
        <Paragraph>
          Smart address: {smartAddress && shortAddress(smartAddress)}{' '}
        </Paragraph>

        <Button
          disabled={isCopyingAccount}
          onPress={handleCopyAccount}
          title={isCopyingAccount ? 'copied!' : 'copy'}
          testID="Copy.Account.Button"
        />
      </View>

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

export default ReceiveScreen
