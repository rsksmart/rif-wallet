import React, { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { generateMnemonic, mnemonicToSeed } from '@rsksmart/rif-id-mnemonic'
import { fromSeed, BIP32Interface } from 'bip32'

import Button from './components/button'
import { Header1, Paragraph } from './components/typrography'
import { rskTestnetAddressFromPrivateKey } from '@rsksmart/rif-id-ethr-did'
import Loading from './components/loading'
import { BigNumber, ethers } from 'ethers'

interface Interface {}

export const seedToRSKHDKey: (seed: Buffer) => BIP32Interface = seed =>
  fromSeed(seed).derivePath("m/44'/37310'/0'/0")

const WalletApp: React.FC<Interface> = () => {
  // App's State for now:
  interface stateInterface {
    mnemonic?: string
    address?: string
    loading?: string
    balance?: number
  }
  const initialState = {
    mnemonic: undefined,
    address: undefined,
    loading: undefined,
    balance: undefined,
  }
  const [state, setState] = useState<stateInterface>(initialState)

  const getMnemonic = () =>
    setState({ ...state, mnemonic: generateMnemonic(12) })

  const getAddress = (mnemonic: string) => {
    setState({ ...state, address: undefined, loading: 'Getting Address' })
    mnemonicToSeed(mnemonic).then((seed: Buffer) => {
      const hdKey = seedToRSKHDKey(seed)
      if (hdKey.derive(0).privateKey) {
        const privateKey = hdKey.derive(0).privateKey?.toString('hex') || ''
        const address = rskTestnetAddressFromPrivateKey(privateKey)

        setState({ ...state, address, loading: undefined })
      }
    })
  }

  const getBalance = () => {
    setState({ ...state, loading: 'Getting balance' })
    console.log('getting balance for: ', state.address)

    const provider = new ethers.providers.JsonRpcProvider(
      'https://public-node.testnet.rsk.co',
    )

    state.address &&
      provider
        .getBalance(state.address.toLowerCase())
        .then((response: BigNumber) =>
          setState({
            ...state,
            balance: parseInt(response.toString(), 10) / Math.pow(10, 18),
            loading: undefined,
          }),
        )
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

      {state.balance !== undefined && (
        <Paragraph>Balance: {state.balance}</Paragraph>
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
