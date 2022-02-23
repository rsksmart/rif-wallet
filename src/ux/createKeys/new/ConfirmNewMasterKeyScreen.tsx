import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Button } from '../../../components'
import { CreateKeysProps, ScreenProps } from '../types'
import { useTranslation } from 'react-i18next'
import { grid } from '../../../styles/grid'

interface ConfirmMasterKeyScreenProps {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}
const shuffle = (array: string[]) => {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ]
  }

  return array
}

const WordInput: React.FC<{
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
        <Text style={styles.wordText}>{initValue}</Text>
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

export const ConfirmNewMasterKeyScreen: React.FC<
  ScreenProps<'ConfirmNewMasterKey'> & ConfirmMasterKeyScreenProps
> = ({ route, navigation, createFirstWallet }) => {
  const mnemonic = route.params.mnemonic
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [words, setWords] = useState<string[]>(shuffle(mnemonic.split(' ')))
  const rows = [1, 2, 3, 4, 5, 6, 7, 8]

  const { t } = useTranslation()

  const [error, setError] = useState<string | null>(null)
  const selectWord = (selectedWord: string) => {
    const a = [...selectedWords, selectedWord]
    setSelectedWords(a)
    setWords(words.filter(word => !a.find(w => w === word)))
  }
  const saveAndNavigate = async () => {
    const rifWallet = await createFirstWallet(mnemonic)
    // @ts-ignore
    navigation.navigate('KeysCreated', { address: rifWallet.address })
  }

  const handleConfirmMnemonic = async () => {
    const isValid = mnemonic === selectedWords.join(' ')

    if (!isValid) {
      setError(t('entered words does not match you your master key'))
      return
    }

    await saveAndNavigate()
  }

  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Confirm your master key</Text>

      {rows.map(row => (
        <View style={grid.row}>
          <WordInput index={row} initValue={selectedWords[row - 1]} />
          <WordInput
            index={row + rows.length}
            initValue={selectedWords[row + rows.length - 1]}
          />
          <WordInput
            index={row + rows.length * 2}
            initValue={selectedWords[row + rows.length * 2 - 1]}
          />
          <Text>{row + rows.length}</Text>
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
      {error && <Text style={styles.defaultText}>{error}</Text>}

      <View>
        <Button
          onPress={handleConfirmMnemonic}
          title={'Confirm'}
          testID="Button.Confirm"
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  defaultText: {
    color: '#ffffff',
  },
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
