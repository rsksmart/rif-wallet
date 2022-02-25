import React from 'react'

import { grid } from '../../../styles/grid'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { colors } from '../../../styles/colors'

export const WordInput: React.FC<{
  wordNumber: number
  initValue: string
}> = ({ wordNumber, initValue }) => {
  return (
    <View
      style={{
        ...grid.column4,
        ...styles.wordContainer,
      }}>
      <Text style={styles.wordNumber}>{wordNumber}. </Text>
      {initValue ? (
        <View style={styles.wordContent}>
          <Text style={styles.wordText}>{initValue}</Text>
        </View>
      ) : (
        <TextInput
          key={wordNumber}
          style={styles.wordInput}
          value={initValue}
          placeholder=""
          editable={false}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  wordContainer: {
    alignItems: 'flex-start',
    alignContent: 'flex-start',
    flexDirection: 'row',
    marginVertical: 4,
    marginLeft: 4,
  },
  wordContent: {
    borderRadius: 20,
    backgroundColor: colors.darkPurple2,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  wordText: {
    color: colors.white,
    fontSize: 14,
  },
  wordNumber: {
    color: colors.white,
    display: 'flex',
    paddingVertical: 4,
  },
  wordInput: {
    borderColor: colors.white,
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
    height: 25,
    color: colors.white,
    fontSize: 15,
  },
})
