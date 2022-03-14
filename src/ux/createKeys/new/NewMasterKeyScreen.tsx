import React, { useMemo } from 'react'
import { StyleSheet, View, ScrollView, Text } from 'react-native'
import { CreateKeysProps, ScreenProps } from '../types'
import { Trans } from 'react-i18next'
import { colors } from '../../../styles/colors'

type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}
import { grid } from '../../../styles/grid'
import { Word } from './Word'
import { NavigationFooter } from '../../../components/button/NavigationFooter'

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])
  const words = mnemonic.split(' ')
  const rows = [0, 1, 2, 3, 4, 5, 6, 7]

  return (
    <>
      <ScrollView style={styles.parent}>
        <Text style={styles.header}>
          <Trans>Write down your master key</Trans>
        </Text>

        {rows.map(row => (
          <View style={grid.row} key={row}>
            <Word wordNumber={row + 1} text={words[row]} />
            <Word
              wordNumber={row + 1 + rows.length}
              text={words[row + rows.length]}
            />
            <Word
              wordNumber={row + 1 + rows.length * 2}
              text={words[row + rows.length * 2]}
            />
          </View>
        ))}
      </ScrollView>
      <NavigationFooter
        onBackwards={() => navigation.navigate('CreateKeys')}
        onPress={() => navigation.navigate('ConfirmNewMasterKey', { mnemonic })}
        title="continue"
      />
    </>
  )
}

const styles = StyleSheet.create({
  parent: {
    backgroundColor: colors.darkBlue,
  },
  header: {
    color: colors.white,
    fontSize: 22,
    paddingVertical: 25,
    marginBottom: 5,
    textAlign: 'center',
    fontWeight: 'bold',
  },
})
