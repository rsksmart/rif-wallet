import React, { useState, useEffect } from 'react'
import { StyleSheet, View, ScrollView, TextInput, Text } from 'react-native'
import { LinearGradient } from '../../../components/linearGradient/LinearGradient'

import { Paragraph } from '../../../components'
import { validateMnemonic } from '../../../lib/bip39'
import { ScreenProps, CreateKeysProps } from '../types'
import {
  getTokenColor,
  getTokenColorWithOpacity,
  setOpacity,
} from '../../../screens/home/tokenColor'
import { SquareButton } from '../../../components/button/SquareButton'
import { Arrow } from '../../../components/icons'

type ImportMasterKeyScreenProps = {
  createFirstWallet: CreateKeysProps['createFirstWallet']
}

export const ImportMasterKeyScreen: React.FC<
  ScreenProps<'ImportMasterKey'> & ImportMasterKeyScreenProps
> = ({ navigation, createFirstWallet, route }) => {
  const [importMnemonic, setImportMnemonic] = useState<string>('')

  useEffect(() => {
    // @ts-ignore
    if (route.params?.mnemonic) {
      // @ts-ignore
      setImportMnemonic(route.params.mnemonic)
    }
  }, [])

  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)

  const handleImportMnemonic = async () => {
    const mnemonicError = validateMnemonic(importMnemonic)
    if (!mnemonicError) {
      try {
        setInfo('Creating...')
        const rifWallet = await createFirstWallet(importMnemonic)
        setInfo(null)
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
  const setText = (text: string) => {
    setError(null)
    setImportMnemonic(text)
  }
  const selectedToken = 'TRBTC'

  const selectedTokenColor = getTokenColor(selectedToken)

  const containerStyles = {
    shadowColor: setOpacity(selectedTokenColor, 0.5),
  }
  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <Text style={styles.header}>Master Key</Text>
      <LinearGradient
        colors={['#FFFFFF', '#E1E1E1']}
        style={{ ...styles.topContainer, ...containerStyles }}>
        <ScrollView style={styles.portfolio}>
          <TextInput
            onChangeText={text => setText(text)}
            value={importMnemonic}
            placeholder="Enter your 12 words master key"
            multiline
          />
        </ScrollView>
      </LinearGradient>
      {info && <Paragraph>{info}</Paragraph>}
      {error && <Paragraph>{error}</Paragraph>}
      <View style={styles.centerRow}>
        <SquareButton
          onPress={() => handleImportMnemonic()}
          title="Confirm"
          testID="Address.CopyButton"
          icon={<Arrow color={getTokenColor(selectedToken)} rotate={90} />}
        />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  parent: {
    height: '100%',
  },
  header: {
    fontSize: 26,
    textAlign: 'center',
  },
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
  input: {
    height: 80,
    margin: 12,
    borderWidth: 1,
    borderColor: '#000',
    padding: 10,
    textAlignVertical: 'top',
  },
  secHeader: {
    fontSize: 18,
    textAlign: 'center',
  },

  portfolio: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 25,
    borderRadius: 25,
    padding: 30,
  },
  topContainer: {
    marginTop: 60,
    marginHorizontal: 25,
    borderRadius: 25,
    backgroundColor: '#ffffff',
    shadowOpacity: 0.1,
    // shadowRadius: 10,
    elevation: 2,
  },
})
