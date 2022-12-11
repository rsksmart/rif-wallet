import React from 'react'
import { Linking, Text } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { getChainIdByType, shortAddress } from '../../lib/utils'
import { Paragraph } from '../typography'
import { toChecksumAddress } from './lib'
import { CompassIcon, CopyIcon } from '../icons'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { getWalletSetting, SETTINGS } from 'src/core/config'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

export const getAddressDisplayText = (
  inputAddress: string,
  chainType: ChainTypeEnum,
) => {
  const checksumAddress = toChecksumAddress(
    inputAddress,
    getChainIdByType(chainType),
  )
  const displayAddress = shortAddress(checksumAddress)
  return { checksumAddress, displayAddress }
}

export const Address: React.FC<{
  chainType?: ChainTypeEnum
  testID?: string
}> = ({
  children,
  chainType = ChainTypeEnum.TESTNET, //RSK Testnet: 31
  testID,
}) => {
  const inputAddress = children as string

  const { displayAddress, checksumAddress } = getAddressDisplayText(
    inputAddress,
    chainType,
  )

  const explorerUrl = getWalletSetting(SETTINGS.EXPLORER_ADDRESS_URL, chainType)

  return (
    <Paragraph>
      <Text testID={testID}>{displayAddress} </Text>
      <TouchableOpacity
        onPress={() => Clipboard.setString(checksumAddress)}
        accessibilityLabel="copy">
        <CopyIcon width={30} height={30} />
      </TouchableOpacity>
      <TouchableOpacity
        accessibilityLabel="explorer"
        onPress={() => {
          Linking.openURL(`${explorerUrl}/address/${checksumAddress}`)
        }}>
        <CompassIcon width={20} height={20} />
      </TouchableOpacity>
    </Paragraph>
  )
}
