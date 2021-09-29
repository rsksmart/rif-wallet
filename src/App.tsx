import React from 'react'
import { View } from 'react-native'
import { Header1, Paragraph } from './components/typrography'

interface Interface {}

const WalletApp: React.FC<Interface> = () => {
  return (
    <View>
      <Header1>sWallet</Header1>
      <Paragraph>Hello sWallet</Paragraph>
    </View>
  )
}

export default WalletApp
