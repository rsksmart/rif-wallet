import React from 'react'

import { StyleSheet, View, Text } from 'react-native'
import { colors } from '../../../styles/colors'

export const Word = ({ number, text }: { number: number; text: string }) => (
  <View style={styles.wordContainer}>
    <View>
      <View style={styles.wordNumberBadge}>
        <Text style={styles.wordNumberBadgeText}>{number} </Text>
      </View>
    </View>
    <View>
      <Text style={styles.wordText}>{text}</Text>
    </View>
  </View>
)

const styles = StyleSheet.create({
  wordContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    fontWeight: 'bold',
    borderRadius: 10,
  },
  wordNumberBadge: {
    backgroundColor: colors.darkBlue,
    padding: 10,
    borderRadius: 20,
  },
  wordNumberBadgeText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 20,
  },
  wordText: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 10,
    paddingTop: 5,
  },
})
