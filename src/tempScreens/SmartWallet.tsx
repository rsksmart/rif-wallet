import React from 'react'
import { ScrollView } from "react-native-gesture-handler"
import Button from '../components/button'
import { Header2, Paragraph } from "../components/typography"
import { Account } from '../lib/core'

const SmartWallet = ({ route }: { route: any }) => {
  const account = route.params.account as Account

  return <ScrollView>
    <Header2>Smart Wallet</Header2>
    <Paragraph>EOA: {account.address}</Paragraph>
  </ScrollView>
}

export default SmartWallet
