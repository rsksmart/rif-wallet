import React, { useMemo } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, CopyComponent, Header2, Paragraph } from '../../../components'
import { CreateKeysProps, ScreenProps } from '../types'

type CreateMasterKeyScreenProps = {
  generateMnemonic: CreateKeysProps['generateMnemonic']
}

export const NewMasterKeyScreen: React.FC<
  ScreenProps<'NewMasterKey'> & CreateMasterKeyScreenProps
> = ({ navigation, generateMnemonic }) => {
  const mnemonic = useMemo(generateMnemonic, [])

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph>
          With your master key (seed phrase) you are able to create as many
          wallets as you need.
        </Paragraph>
      </View>
      <View style={styles.sectionCentered}>
        <Paragraph>copy the key in a safe place ⎘</Paragraph>
      </View>
      <View style={styles.section}>
        <Header2>Master key</Header2>
        <CopyComponent value={mnemonic} testID={'Copy.Mnemonic'} />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() =>
            navigation.navigate('ConfirmNewMasterKey', { mnemonic })
          }
          title={'Next'}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})
