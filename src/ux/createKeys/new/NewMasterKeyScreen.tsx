import React, { useMemo } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { CreateKeysProps, ScreenProps } from '../types'

import { getTokenColor } from '../../../screens/home/tokenColor'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}
import { grid } from '../../../styles/grid'

const Word = ({ index, text }: { index: number; text: string }) => (
  <View
    style={{
      ...grid.column4,
      ...styles.wordContainer,
    }}>
    <Text style={styles.wordIndex}>{index}. </Text>
    <Text style={styles.wordContent}>{text}</Text>
  </View>
)

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const words = mnemonic.split(' ')
  const rows = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <ScrollView style={styles.parent}>
      <Text style={styles.header}>Write down your master key</Text>

      {rows.map((row, i) => (
        <View style={grid.row}>
          <Word index={row} text={words[i]} />
          <Word index={row + rows.length} text={words[i + rows.length]} />
          <Word
            index={row + rows.length * 2}
            text={words[i + 16] + rows.length * 2}
          />
        </View>
      ))}
      {/*TODO:This button will be remove when the navigation is implemented*/}
      <SquareButton
        // @ts-ignore
        onPress={() => navigation.navigate('ImportMasterKey', { mnemonic })}
        title="Continue"
        testID="Address.CopyButton"
        icon={<Arrow color={getTokenColor('RBTC')} rotate={90} />}
      />
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
  wordContent: {
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    color: '#ffffff',
    borderRadius: 30,
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  wordIndex: {
    color: '#ffffff',
    display: 'flex',
    paddingVertical: 5,
  },
  wordContainer: {
    alignItems: 'flex-start',
    color: '#ffffff',
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 5,
  },
})
