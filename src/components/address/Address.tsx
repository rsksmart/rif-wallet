import React from 'react'
import { Linking, Text } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { shortAddress } from '../../lib/utils'
import { Paragraph } from '../typography'
import { toChecksumAddress } from './lib'
import { CompassIcon, CopyIcon } from '../icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getWalletSetting, SETTINGS } from 'src/core/config'

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

  const explorerUrl = getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainId)

  return (
    <Paragraph>
      <Text testID={testID}>{displayAddress} </Text>
      <TouchableOpacity onPress={() => Clipboard.setString(checksumAddress)}>
        <CopyIcon width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(`${explorerUrl}/${checksumAddress}`)
        }}>
        <CompassIcon width={20} height={20} />
      </TouchableOpacity>
    </Paragraph>
  )
}
