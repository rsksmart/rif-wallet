import Clipboard from '@react-native-community/clipboard'
import React from 'react'
import { Linking, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'

import { getChainIdByType, shortAddress } from 'lib/utils'

import { getWalletSetting } from 'src/core/config'
import { SETTINGS } from 'core/types'
import { ChainTypeEnum } from 'store/slices/settingsSlice/types'

import { CompassIcon, CopyIcon } from '../icons'
import { RegularText } from '../typography'
import { toChecksumAddress } from './lib'

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
    <View>
      <RegularText testID={testID}>{displayAddress}</RegularText>
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
    </View>
  )
}
