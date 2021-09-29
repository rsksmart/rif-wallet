import React, { useState } from 'react'
import { View } from 'react-native'
import { generateMnemonic } from '@rsksmart/rif-id-mnemonic'

import Button from './components/button'
import { Header1, Paragraph } from './components/typrography'

interface Interface {}

const WalletApp: React.FC<Interface> = () => {
  const [mnemonic, setMnemonic] = useState<string | null>(null)

  const getMnemonic = () => {
    const temp = generateMnemonic(12)
    setMnemonic(temp)
  }

  return (
    <View>
      <Header1>sWallet</Header1>
      <Paragraph>Hello sWallet</Paragraph>
      <Button onPress={getMnemonic} title="Get Mnemmonic" />

      {mnemonic && <Paragraph>{mnemonic}</Paragraph>}
    </View>
  )
}

export default WalletApp
