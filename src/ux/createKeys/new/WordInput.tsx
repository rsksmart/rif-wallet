import React from 'react'

import { grid } from '../../../styles/grid'
import { StyleSheet, View, Text, TextInput } from 'react-native'

export const WordInput: React.FC<{
  index: number
  initValue: string
}> = ({ index, initValue }) => {
  return (
    <View
      style={{
        ...grid.column4,
        ...styles.wordContainer,
      }}>
      <Text style={styles.wordIndex}>{index}. </Text>
      {initValue ? (
        <View style={styles.wordContent}>
          <Text style={styles.wordText}>{initValue}</Text>
        </View>
      ) : (
        <TextInput
          key={index}
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
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginLeft: 10,
  },
  wordText: {
    color: '#ffffff',
    fontSize: 14,
  },
  wordIndex: {
    color: '#ffffff',
    display: 'flex',
    paddingVertical: 4,
  },
  wordInput: {
    borderColor: '#ffffff',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    textAlignVertical: 'top',
    paddingTop: 0,
    paddingBottom: 0,
    height: 25,
    color: '#ffffff',
    fontSize: 15,
  },
})
