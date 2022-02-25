import React from 'react'

import { grid } from '../../../styles/grid'
import { StyleSheet, View, Text } from 'react-native'

export const Word = ({
  wordNumber,
  text,
}: {
  wordNumber: number
  text: string
}) => (
  <View
    style={{
      ...grid.column4,
      ...styles.wordContainer,
    }}>
    <Text style={styles.wordIndex}>{wordNumber}. </Text>
    <View style={styles.wordContent}>
      <Text style={styles.wordText}>{text}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  wordIndex: {
    color: '#ffffff',
    display: 'flex',
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    paddingVertical: 5,
  },
  wordContent: {
    borderRadius: 30,
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  wordText: {
    color: '#ffffff',
    fontSize: 14,
  },

  wordContainer: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'row',
    marginVertical: 5,
    marginLeft: 5,
  },
})
