import React, { useEffect, useState } from 'react'
import { BigNumber, utils } from 'ethers'

import { StyleSheet, View, ScrollView, TextInput, Linking } from 'react-native'
import { Picker } from '@react-native-picker/picker'

import Button from '../../components/button'

import { Paragraph } from '../../components/typography'
import { getAllTokens } from '../../lib/token/tokenMetadata'

import { TransactionReceipt } from '@ethersproject/abstract-provider'
import { IToken } from '../../lib/token/BaseToken'
import { RIFWallet } from '../../lib/core'

interface Interface {
  route: any
}

const SendTransaction: React.FC<Interface> = ({ route }) => {
  const account = route.params.account as RIFWallet
  const smartAddress = account.smartWalletAddress

  const [to, setTo] = useState('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
  const [selectedSymbol, setSelectedSymbol] = useState<string | undefined>()
  const [availableTokens, setAvailableTokens] = useState<IToken[]>()
  const [amount, setAmount] = useState('')
  const [tx, setTx] = useState<TransactionReceipt | null>(null)
  const [txConfirmed, setTxConfirmed] = useState(false)
  const [txSent, setTxSent] = useState(false)
  const [info, setInfo] = useState('')

  useEffect(() => {
    const action = async () => {
      const tokens = await getAllTokens(account)

      setAvailableTokens(tokens)

      if (tokens.length > 0) {
        setSelectedSymbol(tokens[0].symbol)
      }
    }

    action()
  }, [account])

  const handleNext = () => {
    if (!selectedSymbol) {
      return
    }

    transfer(selectedSymbol)
  }

  const transfer = async (tokenSymbol: string) => {
    if (availableTokens) {
      const selectedToken = availableTokens.find(
        token => token.symbol === tokenSymbol,
      )
      if (selectedToken) {
        try {
          const decimals = await selectedToken.decimals()
          const numberOfTokens = utils.parseUnits(amount, decimals)

          const transferResponse = await selectedToken.transfer(
            to,
            BigNumber.from(numberOfTokens),
          )

          setInfo('Transaction Sent. Please wait...')
          setTxSent(true)
          setTxConfirmed(false)
          const txReceipt = await transferResponse.wait()
          setTx(txReceipt)
          setInfo('Transaction Confirmed.')
          setTxConfirmed(true)
        } catch (e: any) {
          setInfo('Transaction Failed: ' + e.message)
        }
      }
    }
  }

  return (
    <ScrollView>
      <View style={styles.sections}>
        <Paragraph>From: {smartAddress}</Paragraph>
      </View>
      <View style={styles.section}>
        <TextInput
          onChangeText={text => setTo(text)}
          value={to}
          placeholder="To"
          testID={'To.Input'}
        />
      </View>

      <View style={styles.section}>
        <TextInput
          onChangeText={text => setAmount(text)}
          value={amount}
          placeholder="Amount"
          keyboardType="numeric"
          testID={'Amount.Input'}
        />
      </View>

      <View style={styles.section}>
        <Picker
          selectedValue={selectedSymbol}
          onValueChange={itemValue => setSelectedSymbol(itemValue)}
          testID={'Tokens.Picker'}>
          {availableTokens &&
            availableTokens.map(token => (
              <Picker.Item
                key={token.symbol}
                label={token.symbol}
                value={token.symbol}
                testID={token.symbol}
              />
            ))}
        </Picker>
      </View>

      {!txSent && (
        <View style={styles.section}>
          <Button onPress={handleNext} title="Next" testID="Next.Button" />
        </View>
      )}
      <View style={styles.section}>
        <Paragraph>{info}</Paragraph>
      </View>
      {txConfirmed && tx && (
        <View testID={'TxReceipt.View'} style={styles.section}>
          <Paragraph>Tx Hash: {tx && tx.transactionHash}</Paragraph>
          <Button
            title="View in explorer"
            onPress={() => {
              Linking.openURL(
                `https://explorer.testnet.rsk.co/tx/${tx.transactionHash}`,
              )
            }}
          />
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
  sections: {
    flex: 1,
    flexDirection: 'column',
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
  },
})

export default SendTransaction
