import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Dimensions } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import Clipboard from '@react-native-clipboard/clipboard'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'

import QRCode from 'react-native-qrcode-svg'
import { shortAddress } from '../../lib/utils'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const accountLink = 'ilan.rsk'
const account = '0xe8789B348C978b19dfb915a10b761069915c237B'
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

const ReceiveScreen: React.FC<Interface> = () => {
  const { isCopying: isCopyingAccount, handleCopy: handleCopyAccount } =
    useCopy(account)
  const { isCopying: isCopyingAccountLink, handleCopy: handleCopyAccountLink } =
    useCopy(accountLink)

  return (
    <ScrollView>
      <View style={styles.section}>
        <QRCode
          backgroundColor="transparent"
          value={account}
          size={window.width * 0.6}
        />
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
        <Paragraph>{shortAddress(account)} </Paragraph>
        <Button
          disabled={isCopyingAccount}
          onPress={handleCopyAccount}
          title={isCopyingAccount ? 'copied!' : 'copy'}
        />
      </View>

      <View style={styles.section}>
        <Button title="share" />
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
