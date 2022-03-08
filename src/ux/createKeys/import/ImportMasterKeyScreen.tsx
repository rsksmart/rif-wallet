import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { CreateKeysProps, ScreenProps } from '../types'
import { grid } from '../../../styles/grid'
import { validateMnemonic } from '../../../lib/bip39'
import { colors } from '../../../styles/colors'
import { WordInput } from './WordInput'
import { NavigationFooter } from '../../../components/button/NavigationFooter'

type ImportMasterKeyScreenProps = {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ImportMasterKeyScreen: React.FC<
  ScreenProps<'ImportMasterKey'> & ImportMasterKeyScreenProps
> = ({ navigation, createFirstWallet }) => {
  const [selectedWords, setSelectedWords] = useState<string[]>([])

  const rows = [1, 2, 3, 4, 5, 6, 7, 8]
  const onWordSelected = (selectedWord: string, wordNumber: number) => {
    const currentWordsSelections = selectedWords
    currentWordsSelections.splice(wordNumber - 1, 0, selectedWord)
    setSelectedWords(currentWordsSelections)
  }
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const handleImportMnemonic = async () => {
    const mnemonicError = validateMnemonic(selectedWords.join(' '))
    if (!mnemonicError) {
      try {
        setInfo('Creating...')
        const rifWallet = await createFirstWallet(selectedWords.join(' '))
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
    <>
      <ScrollView style={styles.parent}>
        <Text style={styles.header}>Enter your master key</Text>

        {rows.map(row => (
          <View style={grid.row} key={row}>
            <WordInput wordNumber={row} handleSelection={onWordSelected} />
            <WordInput
              wordNumber={row + rows.length}
              handleSelection={onWordSelected}
            />
            <WordInput
              wordNumber={row + rows.length * 2}
              handleSelection={onWordSelected}
            />
          </View>
        ))}
        <Text style={styles.defaultText}> {selectedWords.join(' ')}</Text>
        <View>
          {info && <Text style={styles.defaultText}>{info}</Text>}
          {error && <Text style={styles.defaultText}> {error}</Text>}
        </View>
      </ScrollView>
      <NavigationFooter
        onBackwards={() => navigation.navigate('CreateKeys')}
        onPress={handleImportMnemonic}
        title="confirm"
      />
    </>
  )
}

const styles = StyleSheet.create({
  defaultText: {
    color: colors.white,
  },
  parent: {
    backgroundColor: colors.darkBlue,
  },

  header: {
    color: '#ffffff',
    fontSize: 22,
    paddingVertical: 20,
    textAlign: 'center',
  },
})
