import React, { useMemo } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { CreateKeysProps, ScreenProps } from '../types'
import { Trans } from 'react-i18next'

import { getTokenColor } from '../../../screens/home/tokenColor'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'
type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}
import { grid } from '../../../styles/grid'
import { Word } from './Word'

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const words = mnemonic.split(' ')
  const rows = [0, 1, 2, 3, 4, 5, 6, 7]

  return (
    <View style={styles.parent}>
      <Text style={styles.header}>
        <Trans>Write down your master key</Trans>
      </Text>

      {rows.map(row => (
        <View style={grid.row} key={row}>
          <Word index={row + 1} text={words[row]} />
          <Word index={row + 1 + rows.length} text={words[row + rows.length]} />
          <Word
            index={row + 1 + rows.length * 2}
            text={words[row + rows.length * 2]}
          />
        </View>
      ))}
      {/*TODO:This button will be remove when the navigation is implemented*/}
      <SquareButton
        // @ts-ignore
        onPress={() => navigation.navigate('ConfirmNewMasterKey', { mnemonic })}
        title="Continue"
        testID="Address.CopyButton"
        icon={<Arrow color={getTokenColor('RBTC')} rotate={90} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: '#050134',
  },
  header: {
    color: '#ffffff',
    fontSize: 22,
    paddingVertical: 25,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  wordContent: {
    borderRadius: 30,
    backgroundColor: 'rgba(219, 227, 255, 0.3)',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
})
