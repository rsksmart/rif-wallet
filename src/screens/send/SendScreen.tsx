import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useIsFocused } from '@react-navigation/native'

import {
  Dimensions,
  StyleSheet,
  View,
  TextInput,
  Linking,
  Text,
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
import { Arrow, CompassIcon, CopyIcon } from '../../components/icons'
import { TokenImage } from '../home/TokenImage'
import { getAddressDisplayText } from '../../components'
import Clipboard from '@react-native-community/clipboard'

export type SendScreenProps = {
  rnsResolver: Resolver
}
export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ rnsResolver, route, wallet, navigation }) => {
  const isFocused = useIsFocused()

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
  const [transferHash, setTransferHash] = useState<string | null>(null)

  useEffect(() => {
    setTo(route.params?.to || '')
    setDisplayTo(route.params?.displayTo || '')
    handleTargetAddressChange(
      true,
      route.params?.to as string,
      route.params?.displayTo as string,
    )
    getAllTokens(wallet).then(tokens => setAvailableTokens(tokens))
  }, [wallet, isFocused])

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

          setTransferHash(transferResponse.hash)
          setInfo(t('Transaction Sent. Please wait...'))

          setTxSent(true)
          setTxConfirmed(false)
          const txReceipt = await transferResponse.wait()
          setTransferHash(null)
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

  const handleCopy = () => Clipboard.setString(transferHash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${transferHash}`)

  const windowWidth = Dimensions.get('window').width
  const qrCodeSize = windowWidth * 0.6
  const qrContainerStyle = {
    marginHorizontal: (windowWidth - (qrCodeSize + 20)) / 2,
    width: qrCodeSize + 40,
  }

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <View style={grid.row}>
        <View style={{ ...grid.column2, ...styles.icon }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleChangeToken(selectedSymbol)}>
            <View style={imageStyle}>
              <TokenImage symbol={selectedSymbol} height={30} width={30} />
            </View>
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

      <View>
        <AddressInput
          onChangeText={handleTargetAddressChange}
          value={displayTo}
          placeholder={t('To')}
          testID={'To.Input'}
          rnsResolver={rnsResolver}
          navigation={navigation}
          showContacts={true}
        />
      </View>

      <View />

      {!txSent && (
        <View style={styles.centerRow}>
          <SquareButton
            disabled={!isValidTo}
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
        {transferHash && (
          <React.Fragment>
            <View style={{ ...styles.hashContainer, ...qrContainerStyle }}>
              <Text style={styles.hash}>
                {getAddressDisplayText(transferHash).displayAddress}
              </Text>
            </View>
            <Text style={styles.hashLabel}>hash address</Text>

            <View style={grid.row}>
              <View style={{ ...grid.column6, ...styles.bottomColumn }}>
                <SquareButton
                  onPress={handleCopy}
                  title="copy"
                  testID="Hash.CopyButton"
                  icon={
                    <CopyIcon
                      width={55}
                      height={55}
                      color={getTokenColor(selectedSymbol)}
                    />
                  }
                />
              </View>
              <View style={{ ...grid.column6, ...styles.bottomColumn }}>
                <SquareButton
                  onPress={handleOpen}
                  title="open"
                  testID="Hash.OpenURLButton"
                  icon={
                    <CompassIcon
                      width={30}
                      height={30}
                      color={getTokenColor(selectedSymbol)}
                    />
                  }
                />
              </View>
            </View>
          </React.Fragment>
        )}
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

  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
  },
  hash: {
    color: '#5C5D5D',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  hashContainer: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, .7)',
  },
  hashLabel: {
    color: '#5C5D5D',
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20,
  },
  bottomColumn: {
    alignItems: 'center',
  },
})
