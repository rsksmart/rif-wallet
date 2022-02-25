import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import { CreateKeysProps, ScreenProps } from '../types'
import { useTranslation } from 'react-i18next'
import { grid } from '../../../styles/grid'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
import { getTokenColor } from '../../../screens/home/tokenColor'
import { WordInput } from './WordInput'

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
    setError(null)
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
      setError(t('Entered words does not match you your master key'))
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
      <View style={styles.badgeArea}>
        {words.map(word => (
          <View key={word} style={styles.badgeContainer}>
            <TouchableOpacity
              style={styles.badgeText}
              onPress={() => selectWord(word)}>
              <Text>{word}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      {error && <Text style={styles.defaultText}>{error}</Text>}

      <SquareButton
        // @ts-ignore
        onPress={handleConfirmMnemonic}
        title=""
        testID="Address.CopyButton"
        icon={<Arrow color={getTokenColor('RBTC')} rotate={90} />}
      />
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

  badgeArea: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },
  badgeContainer: {
    padding: 1,

    marginVertical: 1,
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
})
