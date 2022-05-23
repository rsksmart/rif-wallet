import React from 'react'

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
  number: number
  word: string
  isMatch: boolean
  options: string[]
  handleTextChange: any
  selectWord: any
}
export const WordSelector: React.FC<Props> = ({
  number,
  word,
  isMatch,
  options,
  handleTextChange,
  selectWord,
}) => {
  return (
    <View style={styles.selector}>
      <View style={styles.wordContainer}>
        <View>
          <View style={styles.wordNumberBadge}>
            <Text style={styles.wordNumberBadgeText}>{number + 1} </Text>
          </View>
        </View>
        <TextInput
          selectionColor={'#fff'}
          placeholderTextColor="#fff"
          style={styles.textInput}
          onChangeText={newText => handleTextChange(newText, number)}
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
            <TouchableOpacity onPress={() => selectWord('', number)}>
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
        <TouchableOpacity onPress={() => selectWord(item, number)}>
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
  selector: {
    marginBottom: 20,
  },

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
