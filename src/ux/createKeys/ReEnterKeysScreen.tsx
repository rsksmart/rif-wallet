import React, { useMemo, useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native'

import { CreateKeysProps, ScreenProps } from './types'
import { grid } from '../../styles/grid'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}

const WordInput: React.FC<{
  index: number
  initValue: string
}> = ({ index, initValue }) => {
  const [wordText, setWordText] = useState(initValue)
  const [wordLocked, setWordLocked] = useState(false)

  const handleKeyDown = () => {
    if (wordText.trim() !== '') {
      setWordLocked(true)
    }
  }

  return (
    <View
      style={{
        ...grid.column4,
        ...styles.wordContainer,
      }}>
      <Text style={styles.wordIndex}>{index}. </Text>
      {initValue ? (
        <Text style={styles.wordText}>{initValue}</Text>
      ) : (
        <TextInput
          key={index}
          style={styles.wordInput}
          onChangeText={setWordText}
          onSubmitEditing={handleKeyDown}
          /*onKeyPress={handleKeyDown}*/
          value={initValue}
          placeholder=""
          onFocus={() => Keyboard.dismiss()}
        />
      )}
    </View>
  )
}

export const ReEnterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic: string = useMemo(generateMnemonic, [])

  const words = mnemonic.split(' ')
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const rows = [1, 2, 3, 4, 5, 6, 7, 8]
  const selectWord = (selectedWord: string) => {
    console.log({ selectedWord })

    setSelectedWords([...selectedWords, selectedWord])
  }
  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Write down your master key</Text>

      {rows.map(row => (
        <View style={grid.row}>
          <WordInput index={row} initValue={selectedWords[row - 1]} />
          <WordInput
            index={row + rows.length}
            initValue={selectedWords[row + rows.length]}
          />
          <WordInput
            index={row + rows.length * 2}
            initValue={selectedWords[row + rows.length * 2]}
          />
        </View>
      ))}
      <Text>
        {words.map(word => (
          <View
            key={word}
            style={{
              ...styles.badgeContainer,
            }}>
            <TouchableOpacity
              style={styles.badgeText}
              onPress={() => selectWord(word)}>
              <Text>{word}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#050134',
  },
  wordContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginVertical: 3,
    color: '#ffffff',
  },
  wordText: {
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    color: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  badgeContainer: {
    flex: 1,
    padding: 1,
    flexDirection: 'row',
    marginVertical: 5,
  },
  badgeText: {
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    color: '#ffffff',
    borderRadius: 30,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  header: {
    color: '#ffffff',
    fontSize: 22,
    paddingVertical: 20,
    textAlign: 'center',
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
  wordIndex: {
    color: '#ffffff',
    display: 'flex',
    paddingVertical: 5,
  },
})
