import React, { useEffect, useRef, useState } from 'react'

import {
  Dimensions,
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Linking,
  Text,
} from 'react-native'

import { ContractReceipt, BigNumber, utils } from 'ethers'
import { useTranslation } from 'react-i18next'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { Button, CopyComponent, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'
import { Address } from '../../components'
import { AddressInput } from '../../components'
import { RNCamera } from 'react-native-camera'
import Resolver from '@rsksmart/rns-resolver.js'

export type SendScreenProps = {
  rnsResolver: Resolver
}
export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ rnsResolver, route, wallet }) => {
  const smartAddress = wallet.smartWalletAddress
  const { t } = useTranslation()

  const [to, setTo] = useState(route.params?.to || '')
  const [displayTo, setDisplayTo] = useState(route.params?.displayTo || '')
  const [isValidTo, setIsValidTo] = useState(false)
  const [selectedSymbol, setSelectedToken] = useState(
    route.params?.token || 'tRIF',
  )

  const [availableTokens, setAvailableTokens] = useState<IToken[]>()
  const [amount, setAmount] = useState('')
  const [tx, setTx] = useState<ContractReceipt | null>(null)
  const [txConfirmed, setTxConfirmed] = useState(false)
  const [txSent, setTxSent] = useState(false)
  const [info, setInfo] = useState('')
  const cameraRef = useRef<RNCamera>(null)

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6

  useEffect(() => {
    getAllTokens(wallet).then(tokens => setAvailableTokens(tokens))
  }, [wallet])

  const transfer = async (tokenSymbol: string) => {
    setInfo('')
    if (availableTokens) {
      const selectedToken = availableTokens.find(
        token => token.symbol === tokenSymbol,
      )
      if (selectedToken) {
        try {
          const decimals = await selectedToken.decimals()
          const numberOfTokens = utils.parseUnits(amount, decimals)

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
          // @ts-ignore
        } catch (e: any) {
          setInfo(t('Transaction Failed: ') + e.message)
        }
      }
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
  return (
    <ScrollView>
      <View>
        <Paragraph>
          From: <Address>{smartAddress}</Address>
        </Paragraph>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
        }}>
        <View style={styles.cameraContainer}>
          <RNCamera
            ref={cameraRef}
            style={{
              ...styles.preview,
              width: qrCodeSize,
              height: qrCodeSize,
            }}
            ratio="1:1"
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            captureAudio={false}
            onBarCodeRead={async event => {
              const data = decodeURIComponent(event.data)
              setTo(data)
            }}
          />
        </View>
      </View>

      <View>
        <AddressInput
          onChangeText={handleTargetAddressChange}
          value={displayTo}
          placeholder={t('To')}
          testID={'To.Input'}
          rnsResolver={rnsResolver}
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
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => setSelectedToken('TRBTC')}
          disabled={selectedSymbol === 'TRBTC'}
          title="TRBTC"
        />
        <Button
          onPress={() => setSelectedToken('tRIF')}
          disabled={selectedSymbol === 'tRIF'}
          title="tRIF"
        />
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
            onPress={() => {
              transfer(selectedSymbol)
            }}
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
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    marginVertical: 40,
    padding: 20,
    borderRadius: 20,
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
})
