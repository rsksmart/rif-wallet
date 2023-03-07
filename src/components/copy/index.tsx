import Clipboard from '@react-native-community/clipboard'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'

import { RegularText } from '../typography'

interface Interface {
  prefix?: string
  value: string
  testID?: string
}

export const CopyComponent: React.FC<Interface> = ({
  prefix,
  value,
  testID,
}) => {
  return (
    <TouchableOpacity onPress={() => Clipboard.setString(value)}>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <RegularText testID={testID}>
            {prefix}
            {value}
          </RegularText>
        </View>
        <View style={styles.iconColumn}>
          <Text>copy</Text>
        </View>
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
  },
  textColumn: {
    flex: 6,
    paddingLeft: 10,
  },
})
