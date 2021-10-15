import React, { useState } from 'react'
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
import { jsonRpcProvider } from './lib/jsonRpcProvider'

import { RBTCToken } from './lib/token/RBTCToken'
import { Paragraph } from './components/typography'

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
  const [to, setTo] = useState('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
  const [token, setToken] = useState(metadataTokens[0].address)
  const [amount, setAmount] = useState('')
  const [loading, setLoading] = useState(false)

  //TODO: remove when account is avaiable
  const getSigner = async () => {
    let wallet = new Wallet(
      'c8e13a0e09736fe5d6e2a39113ba5c395b3747db1ea7abc0390a98a6dc8a00fc',
    )
    return wallet.connect(jsonRpcProvider)
  }

  const reviewTransaction = () => {
    // to/from/value/data should be provided by the user and gases should be estimated
    const transaction: Transaction = {
      to: to,
      from: '0x987...654', //TODO: Remove the hardcoded private key used to enable a temporal provider
      value: amount,
    }

    route.params.reviewTransaction({
      transaction,
      handleConfirm: transactionConfirmed,
    })
  }

  const transactionConfirmed = async (transaction: Transaction | null) => {
    if (transaction) {
      await next(token)
      console.log('Transaction Confirmed')
    } else {
      console.log('Transaction Cancelled')
    }
  }
  const next = async (tokenAddress: string) => {
    setLoading(true)
    if (tokenAddress) {
      await transferERC20(tokenAddress)
    } else {
      await transferRBTC()
    }
    setLoading(false)
  }
  const transferERC20 = async (tokenAddress: string) => {
    try {
      const connectedWallet = await getSigner()
      let erc20Token: ERC20Token | null = null
      erc20Token = new ERC20Token(
        tokenAddress.toLowerCase(),
        connectedWallet,
        'logo.jpg',
      )
      const decimals = await erc20Token.decimals()
      const numberOfTokens = utils.parseUnits(amount, decimals)
      const transferResponse = await erc20Token.transfer(
        to,
        BigNumber.from(numberOfTokens),
      )

      const receipt = await transferResponse.wait()
      navigation.navigate('TransactionReceived', {
        amount,
        to,
        token: await erc20Token.symbol(),
        txHash: receipt.transactionHash,
      })
    } catch (error) {
      console.error('error', error)
    }
  }
  const transferRBTC = async () => {
    const connectedWallet = await getSigner()
    let rbtcToken: RBTCToken | null = null
    rbtcToken = new RBTCToken(connectedWallet, 'logo.jpg', 31)

    const transferResponse = await rbtcToken.transfer(
      to,
      utils.parseEther(amount),
    )

    const receipt = await transferResponse.wait()
    navigation.navigate('TransactionReceived', {
      amount,
      to,
      token: 'RBTC',
      txHash: receipt.transactionHash,
    })
  }

  return (
    <ScrollView>
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
