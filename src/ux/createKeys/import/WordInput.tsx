import React, { useState } from 'react'

import { grid } from '../../../styles/grid'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { colors } from '../../../styles/colors'

export const WordInput: React.FC<{
  wordNumber: number
  handleSelection: any
}> = ({ wordNumber, handleSelection }) => {
  const [wordText, setWordText] = useState('')
  const [wordLocked, setWordLocked] = useState(false)

  const handleKeyDown = () => {
    if (wordText && wordText.trim() !== '') {
      handleSelection(wordText, wordNumber)
      setWordLocked(true)
    }
  }

  return (
    <View
      style={{
        ...grid.column4,
        ...styles.wordContainer,
      }}>
      <Text style={styles.wordNumber}>{wordNumber}. </Text>
      {wordLocked ? (
        <View style={styles.wordContent}>
          <Text style={styles.wordText}>{wordText}</Text>
        </View>
      ) : (
        <TextInput
          key={wordNumber}
          style={styles.wordInput}
          onChangeText={setWordText}
          onSubmitEditing={handleKeyDown}
          autoCapitalize={'none'}
          value={wordText}
          placeholder=""
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
    paddingLeft: 5,
    height: 25,
    color: colors.white,
    fontSize: 15,
  },
})
