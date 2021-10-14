import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'

import { StyleSheet, View, ScrollView, TextInput, Picker } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Paragraph } from './components/typography'
import Button from './components/button'
import {
  tokensMetadataTestnet,
  tokensMetadataMainnet,
} from './lib/token/tokenMetadata'
import { ERC20Token } from './lib/token/ERC20Token'

const isMainnet = false
const metadataTokens = Object.entries(
  isMainnet ? tokensMetadataMainnet : tokensMetadataTestnet,
).map(keyValue => {
  // @ts-ignore
  return { address: keyValue[0], ...keyValue[1] }
})

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const SendTransaction: React.FC<Interface> = ({ route, navigation }) => {
  const [to, setTo] = useState('')
  const [token, setToken] = useState(metadataTokens[0].address)
  const [amount, setAmount] = useState(0)

  /*  const getSigner = async (index: number = 0) => {
    const url = 'http://localhost:8545'
    const provider = await new ethers.providers.JsonRpcProvider(url)
    const signer = await provider.getSigner(index)
    return signer
  }*/

  const getProvider = async () => {
    const url = 'http://localhost:8545'
    const provider = await new ethers.providers.JsonRpcProvider(url)
    return provider
  }

  const next = async () => {
    const account = route.params.account
    account.connect(await getProvider())
    console.log({ amount, to, token })
    let erc20Token: ERC20Token | null = null

    erc20Token = new ERC20Token(token.toLowerCase(), account, 'logo.jpg')

    const transferTx = await erc20Token!.transfer(to, amount)

    await transferTx.wait()

    /* navigation.navigate('TransactionReceived', {
      amount,
      to,
      token,
      txHash: '0xb3f0725999b7a16516235a709d8b1c871370eb42',
    })*/
  }

  return (
    <ScrollView>
      <View style={styles.section}>
        <Paragraph>Send Transaction</Paragraph>
      </View>

      <View style={styles.section}>
        <TextInput
          onChangeText={text => setTo(text)}
          value={to}
          placeholder="To"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          onChangeText={text => setAmount(text)}
          value={amount}
          placeholder="Amount"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.section}>
        <Picker
          selectedValue={token}
          onValueChange={itemValue => setToken(itemValue)}
          style={{ height: 50, width: 150 }}>
          {metadataTokens.map(token => (
            <Picker.Item label={token.symbol} value={token.address} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Button onPress={next} title="Next" />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    height: '100%',
  },
  screen: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default SendTransaction
