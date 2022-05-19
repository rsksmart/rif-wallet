import React, { useState } from 'react'

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { colors } from '../../../styles/colors'
import { CheckIcon } from '../../../components/icons/CheckIcon'
import DeleteIcon from '../../../components/icons/DeleteIcon'
type Props = {
  expectedWord: string
  words: string[]
  number: number
}
export const WordSelector: React.FC<Props> = ({
  expectedWord,
  words,
  number,
}) => {
  const [word, setWord] = useState('')
  const [isMatch, setIsMatch] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const selectWord = (myWord: string) => {
    handleTextChange(myWord)
  }
  const handleTextChange = (newText: string) => {
    if (newText === expectedWord) {
      setIsMatch(true)
    } else {
      setIsMatch(false)
    }
    setWord(newText)
    if (newText === '') {
      setOptions([])
    } else {
      setOptions(words.filter((w: string) => w.startsWith(newText)).slice(0, 3))
    }
  }
  return (
    <View>
      <View style={styles.wordContainer}>
        <View>
          <View style={styles.wordNumberBadge}>
            <Text style={styles.wordNumberBadgeText}>{number} </Text>
          </View>
        </View>
        <TextInput
          selectionColor={'#fff'}
          placeholderTextColor="#fff"
          style={styles.textInput}
          onChangeText={handleTextChange}
          value={word}
          placeholder="type..."
          keyboardType="numeric"
        />
        <View style={styles.wordStatus}>
          {isMatch && (
            <CheckIcon
              color={colors.white}
              rotate={270}
              width={40}
              height={40}
            />
          )}
          {!isMatch && (
            <TouchableOpacity onPress={() => selectWord('')}>
              <DeleteIcon
                color={colors.white}
                width={40}
                height={40}
                viewBox={'0 -5 25 36'}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
      {options.map(item => (
        <TouchableOpacity onPress={() => selectWord(item)}>
          <View style={styles.wordOptionContainer}>
            <View>
              <Text style={styles.wordText}>{item}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  wordContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    fontWeight: 'bold',
    borderRadius: 10,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  wordOptionContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.darkPurple2,
    fontWeight: 'bold',
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
  textInput: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 18,
  },
  wordStatus: {
    position: 'absolute',
    right: 15,
    top: 15,
    borderRadius: 30,
    backgroundColor: colors.purple,
  },
})
