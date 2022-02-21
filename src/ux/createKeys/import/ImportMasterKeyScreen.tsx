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

import { CreateKeysProps, ScreenProps } from '../types'
import { grid } from '../../../styles/grid'
import { validateMnemonic } from '../../../lib/bip39'
import { Paragraph } from '../../../components'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
import { getTokenColor } from '../../../screens/home/tokenColor'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}

const WordInput: React.FC<{
  index: number
  handleSelection: any
}> = ({ index, handleSelection }) => {
  const [wordText, setWordText] = useState('')
  const [wordLocked, setWordLocked] = useState(false)

  const handleKeyDown = () => {
    if (wordText && wordText.trim() !== '') {
      handleSelection(wordText)
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
      {wordLocked ? (
        <Text style={styles.wordText}>{wordText}</Text>
      ) : (
        <TextInput
          key={index}
          style={styles.wordInput}
          onChangeText={setWordText}
          onSubmitEditing={handleKeyDown}
          /*onKeyPress={handleKeyDown}*/
          value={wordText}
          placeholder=""
        />
      )}
    </View>
  )
}

type ImportMasterKeyScreenProps = {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ImportMasterKeyScreen: React.FC<
  ScreenProps<'ImportMasterKey'> & ImportMasterKeyScreenProps
> = ({ navigation, createFirstWallet, route }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([])
  const [importMnemonic, setImportMnemonic] = useState<string>(
    'huge gap dial bike human family often shove country maple sweet fresh project broken tube increase hat cement mammal inform powder shadow future axis',
  )

  const rows = [1, 2, 3, 4, 5, 6, 7, 8]
  const onWordSelected = (selectedWord: string) => {
    setSelectedWords([...selectedWords, selectedWord])
    setImportMnemonic(selectedWords.join(' '))
  }
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const handleImportMnemonic = async () => {
    console.log(1)
    console.log(importMnemonic)
    console.log(2)
    const mnemonicError = validateMnemonic(importMnemonic)
    console.log({ mnemonicError })
    if (!mnemonicError) {
      try {
        setInfo('Creating...')
        const rifWallet = await createFirstWallet(importMnemonic)
        setInfo(null)
        console.log(rifWallet.address)
        // @ts-ignore
        navigation.navigate('KeysCreated', { address: rifWallet.address })
      } catch (err) {
        console.error(err)
        setError(
          'error trying to import your master key, please check it and try it again',
        )
      }
    }
    setError(mnemonicError)
  }
  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Enter your master key</Text>

      {rows.map(row => (
        <View style={grid.row} key={row}>
          <WordInput index={row} handleSelection={onWordSelected} />
          <WordInput
            index={row + rows.length}
            handleSelection={onWordSelected}
          />
          <WordInput
            index={row + rows.length * 2}
            handleSelection={onWordSelected}
          />
        </View>
      ))}
      <Text style={{ color: '#FFFFFF' }}>{selectedWords}</Text>

      <View>
        {info && <Text style={styles.defaultText}>{info}</Text>}
        {error && <Text style={styles.defaultText}> {error}</Text>}
        <SquareButton
          onPress={() => handleImportMnemonic()}
          title="Confirm"
          testID="Address.CopyButton"
          icon={<Arrow color={getTokenColor('tRBTC')} rotate={90} />}
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
