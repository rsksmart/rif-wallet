import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { Button, Paragraph } from '../../components'
import { CreateKeysProps, ScreenProps } from './types'

type ImportMasterKeyScreenProps = {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}
export const KeysCreatedScreen: React.FC<
  ScreenProps<'KeysCreated'> & ImportMasterKeyScreenProps
> = ({
  route,
  navigation,
  createFirstWallet,
}: {
  route: any
  navigation: any
  createFirstWallet: CreateKeysProps['createFirstWallet']
}) => {
  const mnemonic = route.params.mnemonic

  const navigateToReceive = async () => {
    navigation.navigate('Receive' as any)
  }
  createFirstWallet(mnemonic)
  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph testID="Text.Subtitle">Your new wallet is ready!</Paragraph>
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => navigation.navigate('Home' as any)}
          title={'<- Home'}
        />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => {
            navigateToReceive()
          }}
          title={'Receive money'}
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
