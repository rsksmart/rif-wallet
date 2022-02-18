import React, { useMemo, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, TextInput } from 'react-native'
import { CreateKeysProps, ScreenProps } from '../../ux/createKeys/types'
import { grid } from '../../styles/grid'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}

const WordInput = ({ index, text }: { index: number; text: string }) => (
  <View
    style={{
      ...grid.column4,
      ...styles.wordContainer,
    }}>
    <Text style={styles.wordIndex}>{index}. </Text>
    <TextInput
      style={styles.wordInput}
      onChangeText={() => {}}
      value={text}
      placeholder="Enter your 12 words master key"
      multiline
    />
  </View>
)

export const ReEnterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic: string = useMemo(generateMnemonic, [])

  const words = mnemonic.split(' ')
  const rows = [1, 2, 3, 4, 5, 6, 7, 8]
  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Write down your master key</Text>

      {rows.map((row, i) => (
        <View style={grid.row}>
          <WordInput index={row} text={words[i]} />
          <WordInput index={row + rows.length} text={words[i + rows.length]} />
          <WordInput
            index={row + rows.length * 2}
            text={words[i + 16] + rows.length * 2}
          />
        </View>
      ))}
      <Text style={styles.badgesContainer}>
        {words.map(word => (
          <>
            <Text style={styles.badge}>{word}</Text>
            <Text> </Text>
          </>
        ))}
      </Text>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#050134',
  },
  header: {
    color: '#ffffff',
    fontSize: 22,
    paddingVertical: 20,
    textAlign: 'center',
  },
  wordIndex: {
    color: '#ffffff',
    display: 'flex',
    paddingVertical: 5,
  },
  wordInput: {
    borderColor: '#ffffff',
    borderWidth: 1,
    marginHorizontal: 10,
    borderRadius: 10,
    flex: 1,
    height: 30,
  },
  wordContainer: {
    alignItems: 'flex-start',
    color: '#ffffff',
    flexDirection: 'row',
    marginVertical: 5,
  },
  badge: {
    borderRadius: 10,
    color: '#ffffff',

    backgroundColor: '#403953',
    padding: 10,
  },
  badgesContainer: {},
})
