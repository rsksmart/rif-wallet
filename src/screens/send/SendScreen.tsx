import React, { useEffect, useState } from 'react'

import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Linking,
  Text,
} from 'react-native'
//import { Picker } from '@react-native-picker/picker'
import { ContractReceipt, BigNumber, utils } from 'ethers'
import { useTranslation } from 'react-i18next'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { Button, CopyComponent, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'
import { Address } from '../../components'
import { AddressInput } from '../../components/address'

export const SendScreen: React.FC<ScreenProps<'Send'> & ScreenWithWallet> = ({
  route,
  wallet,
}) => {
  const smartAddress = wallet.smartWalletAddress
  const { t } = useTranslation()

  const [to, setTo] = useState('')
  const [isValidTo, setIsValidTo] = useState(false)
  const [selectedSymbol] = useState(route.params?.token || 'tRIF')
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

  const handleTargetAddressChange = (isValid: boolean, address: string) => {
    setIsValidTo(isValid)
    setTo(address)
  }

  const transferERC20 = async (tokenSymbol: string) => {
    setInfo('')
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
            to.toLowerCase(),
            BigNumber.from(numberOfTokens),
          )

          setInfo(t('Transaction Sent. Please wait...'))
          setTxSent(true)
          setTxConfirmed(false)
          const txReceipt = await transferResponse.wait()
          setTx(txReceipt)
          setInfo(t('Transaction Confirmed.'))
          setTxConfirmed(true)
        } catch (e: any) {
          setInfo(t('Transaction Failed: ') + e.message)
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
      <View>
        <Paragraph>
          From: <Address>{smartAddress}</Address>
        </Paragraph>
      </View>

      <View>
        <AddressInput
          onChangeText={handleTargetAddressChange}
          value={to}
          placeholder={t('To')}
          testID={'To.Input'}
        />
      </View>

      <View>
        <TextInput
          onChangeText={text => setAmount(text)}
          value={amount}
          placeholder={t('Amount')}
          keyboardType="numeric"
          testID={'Amount.Input'}
        />
      </View>
      <View>
        <Paragraph>
          <Text>Token: </Text>
          <Text>{selectedSymbol}</Text>
        </Paragraph>

        {/*<Picker
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
        </Picker>*/}
      </View>

      {!txSent && (
        <View style={styles.section}>
          <Button
            disabled={!isValidTo}
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
          {tx && (
            <CopyComponent value={tx.transactionHash} prefix={'Tx Hash: '} />
          )}
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
  link: {
    color: 'blue',
  },
  error: {
    color: 'red',
  },
})
