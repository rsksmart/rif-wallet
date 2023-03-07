import Clipboard from '@react-native-community/clipboard'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { colors } from '../../styles/colors'
import { getAddressDisplayText } from '../address'
import { CopyIcon } from '../icons/CopyIcon'
import { RegularText } from '../typography'

interface Interface {
  address: string
  chainId?: number
}

export const AddressCopyComponent: React.FC<Interface> = ({
  address,
  chainId,
}) => {
  const { checksumAddress, displayAddress } = getAddressDisplayText(
    address,
    chainId,
  )
  return (
    <TouchableOpacity
      onPress={() => Clipboard.setString(checksumAddress)}
      style={styles.row}>
      <View style={styles.iconColumn}>
        <CopyIcon color={colors.white} />
      </View>
      <View style={styles.textColumn}>
        <RegularText style={styles.address}>{displayAddress}</RegularText>
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  row: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  iconColumn: {
    flex: 1,
    marginRight: 10,
  },
  address: {
    color: colors.white,
  },
  textColumn: {
    flex: 6,
    paddingTop: 5,
  },
})
