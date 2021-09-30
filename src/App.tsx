import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { generateMnemonic, mnemonicToSeed } from '@rsksmart/rif-id-mnemonic'
import { fromSeed, BIP32Interface } from 'bip32'

import Button from './components/button'
import { Header1, Paragraph } from './components/typrography'
import { rskTestnetAddressFromPrivateKey } from '@rsksmart/rif-id-ethr-did'
import Loading from './components/loading'

interface Interface {}

export const seedToRSKHDKey: (seed: Buffer) => BIP32Interface = seed =>
  fromSeed(seed).derivePath("m/44'/37310'/0'/0")

const WalletApp: React.FC<Interface> = () => {
  // App's State for now:
  interface stateInterface {
    mnemonic: string | null
    address: string | null
    loading: string | null
  }
  const initialState = {
    mnemonic: null,
    address: null,
    loading: null,
  }
  const [state, setState] = useState<stateInterface>(initialState)

  const getMnemonic = () =>
    setState({ ...state, mnemonic: generateMnemonic(12) })

  const getAddress = (mnemonic: string) => {
    setState({ ...state, address: null, loading: 'Getting Address' })
    mnemonicToSeed(mnemonic).then((seed: Buffer) => {
      const hdKey = seedToRSKHDKey(seed)
      if (hdKey.derive(0).privateKey) {
        const privateKey = hdKey.derive(0).privateKey?.toString('hex') || ''
        const address = rskTestnetAddressFromPrivateKey(privateKey)

        setState({ ...state, address, loading: null })
      }
    })
  }

  const getBalance = () => {
    console.log('getting balance...')
  }

  return (
    <View>
      <Header1>sWallet</Header1>
      <Paragraph>Hello sWallet</Paragraph>
      <Button
        onPress={getMnemonic}
        title="Get Mnemmonic"
        disabled={!!state.mnemonic}
      />
      {state.mnemonic && (
        <View style={styles.section}>
          <Paragraph>{state.mnemonic}</Paragraph>
          <Button
            // @ts-ignore
            onPress={() => getAddress(state.mnemonic)}
            title="Get Address"
          />
          {state.address && <Paragraph>Address: {state.address}</Paragraph>}
        </View>
      )}

      {state.address && (
        <View style={styles.section}>
          <Button onPress={getBalance} title="Get Balance" />
        </View>
      )}

      {state.loading && <Loading reason={state.loading} />}

      <View style={styles.section}>
        <Button onPress={() => setState(initialState)} title="reset" />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default WalletApp
