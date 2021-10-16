import React, { useEffect, useState } from 'react'
import { Wallet, BigNumber, utils } from 'ethers'

import { StyleSheet, View, ScrollView, TextInput } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { NavigationProp, ParamListBase } from '@react-navigation/native'
import { Transaction } from '@rsksmart/rlogin-eip1193-types'

import Button from './components/button'
import {
  tokensMetadataTestnet,
  tokensMetadataMainnet,
} from './lib/token/tokenMetadata'
import { ERC20Token } from './lib/token/ERC20Token'

import { RBTCToken } from './lib/token/RBTCToken'
import { Paragraph } from './components/typography'

import Account from './lib/core/Account'
import { TransactionResponse } from '@ethersproject/abstract-provider'

const isMainnet = false
const metadataERC20Tokens = Object.entries(
  isMainnet ? tokensMetadataMainnet : tokensMetadataTestnet,
).map(keyValue => {
  // @ts-ignore
  return { address: keyValue[0], ...keyValue[1] }
})
const metadataTokens = [
  { name: 'rBTC', symbol: 'rBTC', address: null },
  ...metadataERC20Tokens,
]

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const SendTransaction: React.FC<Interface> = ({ navigation, route }) => {
  const [smartAddress, setSmartAddress] = useState('')
  const [to, setTo] = useState('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
  const [token, setToken] = useState(metadataTokens[0].address)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [tx, setTx] = useState<TransactionResponse | null>(null)
  const [txConfirmed, setTxConfirmed] = useState(false)

  const account = route.params.account as Account

  useEffect(() => {
    account.getSmartAddress().then(setSmartAddress)
  })

  const reviewTransaction = () => {
    if (token) {
      transferERC20(token)
    } else {
      transferRBTC()
    }
  }

  const transferERC20 = async (tokenAddress: string) => {
    let erc20Token: ERC20Token | null = null
    erc20Token = new ERC20Token(
      tokenAddress.toLowerCase(),
      account,
      'logo.jpg',
    )
    const decimals = await erc20Token.decimals()
    const numberOfTokens = utils.parseUnits(amount, decimals)
    const transferResponse = await erc20Token.transfer(
      to,
      BigNumber.from(numberOfTokens),
    )

    setTx(transferResponse)
    setTxConfirmed(false)
    await transferResponse.wait()
    setTxConfirmed(true)
  }

  const transferRBTC = async () => {
    let rbtcToken: RBTCToken | null = null
    rbtcToken = new RBTCToken(account, 'logo.jpg', 31)

    const transferResponse = await rbtcToken.transfer(
      to,
      utils.parseEther(amount),
    )

    setTx(transferResponse)
    setTxConfirmed(false)
    await transferResponse.wait()
    setTxConfirmed(true)

  }

  return (
    <ScrollView>
      <View style={{
        flex: 1,
        flexDirection: "column"
      }}><Paragraph>From: {smartAddress}</Paragraph></View>
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
          onValueChange={itemValue => setToken(itemValue)}>
          {metadataTokens.map(token => (
            <Picker.Item
              key={token.symbol}
              label={token.symbol}
              value={token.address}
            />
          ))}
        </Picker>
      </View>
      {loading && (
        <View>
          <Paragraph>Please wait...</Paragraph>
        </View>
      )}
      {!loading && (
        <View>
          {/*<Button onPress={() => next(token)} title="Next" />*/}
          <Button onPress={reviewTransaction} title="Next" />
        </View>
      )}
      {tx && <Paragraph>{tx.hash}{txConfirmed && ' confirmed'}</Paragraph>}
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
    flex: 1
  },
})

export default SendTransaction
