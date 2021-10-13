import React, { useState } from 'react'
import { ScrollView } from "react-native-gesture-handler"
import Button from '../components/button'
import { Header2, Paragraph } from "../components/typography"
import { Account } from '../lib/core'
import { SmartWalletFactory } from '../lib/core/smartWallet/smart-wallet-factory'

const SmartWallet = ({ route }: { route: any }) => {
  const [smartWalletAddress, setSmartWalletAddress] = useState('')
  const [smartWalletCode, setSmartWalletCode] = useState('')

  const account = route.params.account as Account

  const smartWalletFactory = new SmartWalletFactory(account)

  const getInfo = () => {
    Promise.all([
      smartWalletFactory.getSmartAddress().then(setSmartWalletAddress),
      smartWalletFactory.getCodeInSmartWallet().then(setSmartWalletCode)
    ]).catch(console.log)
  }

  return <ScrollView>
    <Header2>Smart Wallet</Header2>
    <Paragraph>EOA: {account.address}</Paragraph>
    <Button title="Get info" onPress={getInfo} />
    <Paragraph>Smart wallet address: {smartWalletAddress}</Paragraph>
    <Paragraph>Smart wallet code: {smartWalletCode}</Paragraph>
  </ScrollView>
}

export default SmartWallet
