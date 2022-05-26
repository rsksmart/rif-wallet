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
import { sharedMnemonicStyles } from './styles'
type Props = {
  words: string[]
  wordIndex: number
  onWordSelected: any
}
export const WordSelector: React.FC<Props> = ({
  words,
  wordIndex,
  onWordSelected,
}) => {
  const [word, setWord] = useState('')
  const [isMatch, setIsMatch] = useState(false)
  const [options, setOptions] = useState<string[]>([])
  const expectedWord = words[wordIndex]

  const selectWord = (myWord: string) => {
    handleTextChange(myWord)
    setOptions([])
  }
  const handleTextChange = (newText: string) => {
    onWordSelected(newText, wordIndex)

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
    <View style={styles.selector}>
      <View style={sharedMnemonicStyles.wordContainer}>
        <View>
          <View style={sharedMnemonicStyles.wordNumberBadge}>
            <Text
              testID={'view.indexLabel'}
              style={sharedMnemonicStyles.wordNumberBadgeText}>
              {wordIndex + 1}
            </Text>
          </View>
        </View>
        <TextInput
          testID={'input.wordInput'}
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
            <View testID={'checkIcon'}>
              <CheckIcon
                color={colors.white}
                rotate={270}
                width={40}
                height={40}
              />
            </View>
          )}
          {!isMatch && (
            <TouchableOpacity
              onPress={() => selectWord('')}
              testID={'deleteIcon'}>
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
      {options.map((item, index) => (
        <TouchableOpacity onPress={() => selectWord(item)} key={index}>
          <View style={styles.wordOptionContainer}>
            <View>
              <Text
                testID={`view.option.${index}`}
                style={sharedMnemonicStyles.wordText}>
                {item}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  selector: {
    marginBottom: 20,
  },

  wordOptionContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.darkPurple2,
    fontWeight: 'bold',
  },
  textInput: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 18,
    flex: 1,
  },
  wordStatus: {
    borderRadius: 30,
    backgroundColor: colors.purple,
  },
})
