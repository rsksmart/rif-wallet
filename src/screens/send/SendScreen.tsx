import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput, Linking } from 'react-native'
import { Picker } from '@react-native-picker/picker'
import { ContractReceipt, BigNumber, utils } from 'ethers'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { Button, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'

export const SendScreen: React.FC<ScreenProps<'Send'> & ScreenWithWallet> = ({
  route,
  wallet,
}) => {
  const smartAddress = wallet.smartWalletAddress

  const [to, setTo] = useState('0x1D4F6A5FE927f0E0e4497B91CebfBcF64dA1c934')
  const [selectedSymbol, setSelectedSymbol] = useState(
    route.params?.token || 'tRIF',
  )
  const [availableTokens, setAvailableTokens] = useState<IToken[]>()
  const [amount, setAmount] = useState('')
  const [tx, setTx] = useState<ContractReceipt | null>(null)
  const [txConfirmed, setTxConfirmed] = useState(false)
  const [txSent, setTxSent] = useState(false)
  const [info, setInfo] = useState('')

  useEffect(() => {
    getAllTokens(wallet).then(tokens => setAvailableTokens(tokens))
  }, [wallet])

  const reviewTransaction = () => {
    if (selectedSymbol === 'TRBTC') {
      transferRBTC()
    } else {
      transferERC20(selectedSymbol)
    }
  }

  const transferERC20 = async (tokenSymbol: string) => {
    if (availableTokens) {
      const selectedToken = availableTokens.find(
        token => token.symbol === tokenSymbol,
      )
      if (selectedToken) {
        try {
          const decimals = await selectedToken.decimals()
          const numberOfTokens = utils.parseUnits(amount, decimals)
          /*const balance = await selectedToken.balance()
          console.log({ balance })*/

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
        } catch (e) {
          setInfo('Transaction Failed: ' + e.message)
        }
      }
    }
  }

  const transferRBTC = async () => {
    setInfo('TRBTC transfer not supported')
    /* try {
      let rbtcToken: RBTCToken | null = null
      rbtcToken = new RBTCToken(account, '', 'logo.jpg', 31)

      const transferResponse = await rbtcToken.transfer(
        to,
        utils.parseEther(amount),
      )

      setInfo('Transaction Sent. Please wait...')
      setTxSent(true)
      setTxConfirmed(false)
      const txReceipt = await transferResponse.wait()
      setTx(txReceipt)
      setInfo('Transaction Confirmed.')
      console.log({ txReceipt })
      setTxConfirmed(true)
    } catch (e) {
      setInfo('Transaction Failed: ' + e.message)
    }*/
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
          <Button
            onPress={reviewTransaction}
            title="Next"
            testID="Next.Button"
          />
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
