import React from 'react'
import { StyleSheet, View } from 'react-native'

export const Separator = () => <View style={styles.separator} />

const styles = StyleSheet.create({
  separator: {
    borderBottomColor: '#66777E',
    borderBottomWidth: 3,
    width: '60%',
  },
})
