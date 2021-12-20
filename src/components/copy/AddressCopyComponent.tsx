import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { shortAddress } from '../../lib/utils'
import { CopyIcon } from '../icons/CopyIcon'

interface Interface {
  address: string
}

export const AddressCopyComponent: React.FC<Interface> = ({ address }) => {
  return (
    <TouchableOpacity
      onPress={() => Clipboard.setString(address)}
      style={styles.row}>
      <View style={styles.iconColumn}>
        <CopyIcon />
      </View>
      <View style={styles.textColumn}>
        <Text>{shortAddress(address)}</Text>
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
    backgroundColor: '#d5d5d5',
    borderRadius: 15,
    flex: 1,
    marginRight: 10,
  },
  textColumn: {
    flex: 6,
    paddingTop: 5,
  },
})
