import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'

import {
  StyleSheet,
  View,
  TextInput,
  Linking,
  TouchableOpacity,
} from 'react-native'

import { ContractReceipt, BigNumber, utils } from 'ethers'
import { useTranslation } from 'react-i18next'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { Button, CopyComponent, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'
import { AddressInput } from '../../components'
import Resolver from '@rsksmart/rns-resolver.js'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow } from '../../components/icons'
import { TokenImage } from '../home/TokenImage'

export type SendScreenProps = {
  rnsResolver: Resolver
}
export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ rnsResolver, route, wallet }) => {
  const { t } = useTranslation()

  const [to, setTo] = useState(route.params?.to || '')
  const [displayTo, setDisplayTo] = useState(route.params?.displayTo || '')
  const [isValidTo, setIsValidTo] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState(
    route.params?.token || 'tRIF',
  )

  const [availableTokens, setAvailableTokens] = useState<IToken[]>()
  const [amount, setAmount] = useState('')
  const [tx, setTx] = useState<ContractReceipt | null>(null)
  const [txConfirmed, setTxConfirmed] = useState(false)
  const [txSent, setTxSent] = useState(false)
  const [info, setInfo] = useState('')
  //const selectedSymbol = 'TRBTC'

  useEffect(() => {
    getAllTokens(wallet).then(tokens => setAvailableTokens(tokens))
  }, [wallet])

  const transfer = async (tokenSymbol: string) => {
    setInfo('')
    if (availableTokens) {
      const selectedSymbol = availableTokens.find(
        token => token.symbol === tokenSymbol,
      )
      if (selectedSymbol) {
        try {
          const decimals = await selectedSymbol.decimals()
          const numberOfTokens = utils.parseUnits(amount, decimals)

          const transferResponse = await selectedSymbol.transfer(
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
          // @ts-ignore
        } catch (e: any) {
          setInfo(t('Transaction Failed: ') + e.message)
        }
      }
    }
  }
  const handleChangeToken = (selection: string) => {
    if (selection === 'tRIF') {
      setSelectedSymbol('TRBTC')
    } else {
      setSelectedSymbol('tRIF')
    }
  }
  const handleTargetAddressChange = (
    isValid: boolean,
    address: string,
    displayAddress: string,
  ) => {
    setIsValidTo(isValid)
    setTo(address)
    setDisplayTo(displayAddress)
  }
  const imageStyle = {
    ...styles.image,
    shadowColor: '#000000',
  }
  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <View style={grid.row}>
        <View style={{ ...grid.column2, ...styles.icon }}>
          {/*<View style={{ ...grid.column2, ...styles.icon }}>
              <TokenImage symbol={token.symbol} height={45} width={45} />
            </View>*/}

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangeToken(selectedSymbol)}
            /*onPress={onPress}
              disabled={disabled}
              testID={testID}*/
          >
            <View style={imageStyle}>
              <TokenImage symbol={selectedSymbol} height={30} width={30} />
            </View>

            {/*<View style={imageStyle}>{icon}</View>*/}
            {/*<Text style={styles.text}>{title}</Text>*/}
          </TouchableOpacity>
        </View>
        <View style={{ ...grid.column10 }}>
          <TextInput
            style={styles.input}
            onChangeText={text => setAmount(text)}
            value={amount}
            placeholder={t('Amount')}
            keyboardType="numeric"
            testID={'Amount.Input'}
          />
        </View>
      </View>

      {/* <View>
        <Paragraph>
          From: <Address>{smartAddress}</Address>
        </Paragraph>
      </View>*/}

      <View>
        <AddressInput
          onChangeText={handleTargetAddressChange}
          value={displayTo}
          placeholder={t('To')}
          testID={'To.Input'}
          rnsResolver={rnsResolver}
        />
      </View>

      <View />
      {/*<View>
        <Paragraph>
          <Text>Token: </Text>
          <Text>{selectedSymbol}</Text>
        </Paragraph>
      </View>*/}
      {/*<View style={styles.section}>*/}
      {/* <Button
          onPress={() => setSelectedSymbol('TRBTC')}
          disabled={selectedSymbol === 'TRBTC'}
          title="TRBTC"
        />
        <Button
          onPress={() => setSelectedSymbol('tRIF')}
          disabled={selectedSymbol === 'tRIF'}
          title="tRIF"
        />*/}
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
      {/* </View>*/}

      {!txSent && (
        /*  <View style={styles.section}>
          <Button
            disabled={!isValidTo}
            onPress={() => {
              transfer(selectedSymbol)
            }}
            title="Next"
            testID="Next.Button"
          />
        </View>*/
        <View style={styles.centerRow}>
          <SquareButton
            disabled={!isValidTo}
            // @ts-ignore
            onPress={async () => {
              await transfer(selectedSymbol)
            }}
            title="Next"
            testID="Address.CopyButton"
            icon={<Arrow color={getTokenColor(selectedSymbol)} rotate={90} />}
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
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  image: {
    width: 50,
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 2,
    justifyContent: 'center',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    marginTop: 14,
    paddingLeft: 5,
  },
  parent: {
    height: '100%',
    paddingTop: 20,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },
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
