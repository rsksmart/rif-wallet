import React from 'react'
import { Text, TouchableHighlight, Linking, StyleSheet } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { shortAddress } from '../../lib/utils'
import { Paragraph } from '../typography'
import { toChecksumAddress } from './lib'

const explorerAddressUrlByChainId: { [chainId: number]: string } = {
  30: 'https://explorer.rsk.co/address/',
  31: 'https://explorer.testnet.rsk.co/address/',
}

export const getAddressDisplayText = (inputAddress: string, chainId = 31) => {
  const checksumAddress = toChecksumAddress(inputAddress, chainId)
  const displayAddress = shortAddress(checksumAddress)
  return { checksumAddress, displayAddress }
}

export const Address: React.FC<{ chainId?: number; testID?: string }> = ({
  children,
  chainId = 31, //RSK Testnet: 31
  testID,
}) => {
  const inputAddress = children as string

  const { displayAddress, checksumAddress } = getAddressDisplayText(
    inputAddress,
    chainId,
  )

  const explorerUrl = explorerAddressUrlByChainId[chainId]!

  return (
    <Paragraph>
      <Text testID={testID}>{displayAddress} </Text>
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
    </Paragraph>
  )
}

const styles = StyleSheet.create({
  link: {
    color: 'blue',
  },
})
