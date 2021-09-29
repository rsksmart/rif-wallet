import React, { useState } from 'react'
import { View } from 'react-native'
import { generateMnemonic, mnemonicToSeed } from '@rsksmart/rif-id-mnemonic'
import { fromSeed, BIP32Interface } from 'bip32'

import Button from './components/button'
import { Header1, Paragraph } from './components/typrography'
import { rskTestnetAddressFromPrivateKey } from '@rsksmart/rif-id-ethr-did'

interface Interface {}

export const seedToRSKHDKey: (seed: Buffer) => BIP32Interface = seed =>
  fromSeed(seed).derivePath("m/44'/37310'/0'/0")

const WalletApp: React.FC<Interface> = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(
    'host inside traffic avoid hybrid once echo mosquito cycle maze panther smooth',
  )
  const [address, setAddress] = useState<string | null>(null)

  const getMnemonic = () => {
    setAddress(null)
    const newMnemonic = generateMnemonic(12)
    console.log(newMnemonic)
    setMnemonic(newMnemonic)
  }

  const getAddress = () => {
    if (!mnemonic) return

    mnemonicToSeed(mnemonic).then((seed: Buffer) => {
      const hdKey = seedToRSKHDKey(seed)
      if (hdKey.derive(0).privateKey) {
        const privateKey = hdKey.derive(0).privateKey?.toString('hex') || ''
        const testnetAddress = rskTestnetAddressFromPrivateKey(privateKey)
        setAddress(testnetAddress)
      }
    })
  }

  return (
    <View>
      <Header1>sWallet</Header1>
      <Paragraph>Hello sWallet</Paragraph>
      <Button onPress={getMnemonic} title="Get Mnemmonic" />
      {mnemonic && <Paragraph>{mnemonic}</Paragraph>}

      <Button onPress={getAddress} title="Get Address" />
      {address && <Paragraph>Address: {address}</Paragraph>}
    </View>
  )
}

export default WalletApp
