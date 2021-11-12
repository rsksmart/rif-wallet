import React from 'react'
const rskUtils = require('@rsksmart/rsk-utils')
import { Text, TouchableHighlight, Linking, StyleSheet } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { shortAddress } from '../../lib/utils'
const testnetExplorer = 'https://explorer.testnet.rsk.co/address/'
const mainnetExplorer = 'https://explorer.rsk.co/address/address/'
export const Address: React.FC<{ chainId?: number }> = ({
  children,
  chainId = 31, //RSK Testnet: 31
}) => {
  const inputAddress = children as string
  const checksumAddress = rskUtils.toChecksumAddress(inputAddress, chainId)
  const explorerUrl = chainId === 31 ? testnetExplorer : mainnetExplorer
  return (
    <>
      {shortAddress(checksumAddress)}{' '}
      <TouchableHighlight>
        <Text
          style={styles.link}
          onPress={() => {
            Clipboard.setString(checksumAddress)
          }}>
          [Copy]
        </Text>
      </TouchableHighlight>
      <TouchableHighlight>
        <Text
          style={styles.link}
          onPress={() => {
            Linking.openURL(`${explorerUrl}/${checksumAddress}`)
          }}>
          {' '}
          [View]
        </Text>
      </TouchableHighlight>
    </>
  )
}

const styles = StyleSheet.create({
  link: {
    color: 'blue',
  },
})
