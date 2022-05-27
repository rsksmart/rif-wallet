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
import { wordlists } from 'bip39'

type Props = {
  wordIndex: number
  expectedWord: string
  onWordSelected: any
}
export const WordSelector: React.FC<Props> = ({
  wordIndex,
  expectedWord,
  onWordSelected,
}) => {
  const [userInput, setUserInput] = useState('')
  const [isMatch, setIsMatch] = useState(false)
  const [options, setOptions] = useState<string[]>([])

  const selectWord = (myWord: string) => handleTextChange(myWord)

  const handleTextChange = (newText: string) => {
    // don't allow the user to keep typing if there is a match
    if (isMatch) {
      return
    }

    setUserInput(newText)

    if (newText === expectedWord) {
      setIsMatch(true)
      setOptions([])
      // only trigger the parent if there is a match
      return onWordSelected(newText, wordIndex)
    }

    // user choose the top option but it is not correct
    if (newText === options[0]) {
      return setOptions([])
    }

    // show the suggestions to the user
    newText === ''
      ? setOptions([])
      : setOptions(
          wordlists.EN.filter((w: string) => w.startsWith(newText)).slice(0, 3),
        )
  }

  const handleEnterPress = () => {
    if (options.length !== 0) {
      handleTextChange(options[0])
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
          onSubmitEditing={handleEnterPress}
          value={userInput}
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
