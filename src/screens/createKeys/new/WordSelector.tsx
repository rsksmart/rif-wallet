import { forwardRef, RefObject, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { wordlists } from 'bip39'

import { CheckIcon } from 'components/icons/CheckIcon'
import { DeleteIcon } from 'components/icons'
import { sharedMnemonicStyles } from './styles'
import { colors } from 'src/styles/colors'
import { testIDs } from 'shared/constants'

interface Props {
  wordIndex: number
  onWordSelected: (word: string, index: number) => void
  onSubmitEditing?: (index: number) => void
  itemIndex?: number
  nextTextInputRef?: RefObject<TextInput>
  expectedWord?: string
}

export const WordSelector = forwardRef<TextInput, Props>(
  (
    {
      itemIndex,
      wordIndex,
      expectedWord,
      onWordSelected,
      onSubmitEditing,
      nextTextInputRef,
    },
    ref,
  ) => {
    const { t } = useTranslation()
    const [userInput, setUserInput] = useState('')
    const [isMatch, setIsMatch] = useState(false)
    const [options, setOptions] = useState<string[]>([])

    const selectWord = (myWord: string) => {
      handleTextChange(myWord)
      // Keyboard.dismiss()
      setOptions([])
    }

    const handleTextChange = (input: string) => {
      // don't allow the user to keep typing if there is a match
      if (isMatch) {
        setOptions([])
        return
      }

      // sanitize input
      const newText = input.replace(/[^a-zA-Z]/g, '').toLowerCase()
      setUserInput(newText)

      if (newText === expectedWord) {
        setIsMatch(true)
        setOptions([])
        // only trigger the parent if there is a match

        nextTextInputRef?.current?.focus()

        return onWordSelected(newText, wordIndex)
      }
      if (!expectedWord) {
        onWordSelected(newText, wordIndex)
      }

      // user choose the top option but it is not correct
      if (newText === options[0]) {
        return setOptions([])
      }

      // show the suggestions to the user
      if (newText) {
        setOptions(
          wordlists.EN.filter((w: string) => w.startsWith(newText)).slice(0, 3),
        )
      } else {
        setOptions([])
      }
    }

    const handleEnterPress = () => {
      if (options.length !== 0) {
        handleTextChange(options[0])
      }

      nextTextInputRef?.current?.focus()
      onSubmitEditing && itemIndex && onSubmitEditing(itemIndex)
    }

    const wordRowStyle =
      options.length === 0
        ? sharedMnemonicStyles.wordRow
        : styles.wordRowWithSuggestions

    return (
      <View style={sharedMnemonicStyles.wordContainer}>
        <View style={wordRowStyle}>
          <View>
            <View style={sharedMnemonicStyles.wordNumberBadge}>
              <Text
                testID={testIDs.indexLabel}
                style={sharedMnemonicStyles.wordNumberBadgeText}>
                {wordIndex + 1}
              </Text>
            </View>
          </View>
          {ref && (
            <TextInput
              ref={ref}
              autoCorrect={false}
              testID={testIDs.wordInput}
              selectionColor={'#fff'}
              placeholderTextColor="#fff"
              style={styles.textInput}
              onChangeText={handleTextChange}
              onSubmitEditing={handleEnterPress}
              value={userInput}
              placeholder={t('type_placeholder')}
              autoCapitalize="none"
              onBlur={() => setOptions([])}
              autoCompleteType="off"
              accessibilityLabel={`wordInput${wordIndex + 1}`}
            />
          )}
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
                testID={'deleteIcon'}
                accessibilityLabel={`deleteButton${wordIndex + 1}`}>
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
        <View style={sharedMnemonicStyles.suggestionRow}>
          {options.map((item, index) => (
            <TouchableOpacity
              onPress={() => selectWord(item)}
              key={index}
              accessibilityLabel={`selectSuggestion${index}`}>
              <View
                style={
                  index === 0
                    ? styles.firstSuggestion
                    : styles.wordOptionContainer
                }>
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
      </View>
    )
  },
)

const styles = StyleSheet.create({
  wordOptionContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    fontWeight: 'bold',
  },
  textInput: {
    marginLeft: 10,
    color: colors.white,
    fontSize: 18,
    flex: 1,
  },
  wordStatus: {
    ...sharedMnemonicStyles.wordNumberBadge,
    backgroundColor: colors.purple,
  },
  wordRowWithSuggestions: {
    ...sharedMnemonicStyles.wordRow,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  firstSuggestion: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    fontWeight: 'bold',
    backgroundColor: colors.blue,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
})
