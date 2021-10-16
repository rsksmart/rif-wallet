import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import { Paragraph } from '../typography'

interface Interface {
  value: string
}

const CopyComponent: React.FC<Interface> = ({ value }) => {
  return (
    <TouchableOpacity onPress={() => Clipboard.setString(value)}>
      <View style={styles.row}>
        <View style={styles.textColumn}>
          <Paragraph>{value}</Paragraph>
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

export default CopyComponent
