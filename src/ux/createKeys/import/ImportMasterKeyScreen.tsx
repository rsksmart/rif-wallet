import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { CreateKeysProps, ScreenProps } from '../types'
import { grid } from '../../../styles/grid'
import { validateMnemonic } from '../../../lib/bip39'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
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
  const [info] = useState<string | null>(null)
  const handleImportMnemonic = async () => {
    await createFirstWallet(
      'huge gap dial bike human family often shove country maple sweet fresh project broken tube increase hat cement mammal inform powder shadow future axis',
    )
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

          <SquareButton
            onPress={handleImportMnemonic}
            title=""
            testID="Address.CopyButton"
            icon={<Arrow color={colors.gray} rotate={90} />}
          />
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
