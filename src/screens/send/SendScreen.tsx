import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useIsFocused } from '@react-navigation/native'

import {
  StyleSheet,
  View,
  TextInput,
  Linking,
  TouchableOpacity,
  ScrollView
} from 'react-native'

import { ContractReceipt, BigNumber, utils } from 'ethers'
import { useTranslation } from 'react-i18next'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'
import { AddressInput } from '../../components'
import Resolver from '@rsksmart/rns-resolver.js'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, RefreshIcon } from '../../components/icons'
import { TokenImage } from '../home/TokenImage'
import Clipboard from '@react-native-community/clipboard'
import TransactionInfo from './TransactionInfo'
import QRScanner from '../../components/qrScanner'

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
  const [txSent, setTxSent] = useState(false)
  const [info, setInfo] = useState('')
  const [transferHash, setTransferHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)

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
    setError(null)
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
          const txReceipt = await transferResponse.wait()
          setTransferHash(null)
          setTx(txReceipt)
          setInfo(t('Transaction Confirmed.'))
          // @ts-ignore
        } catch (e: any) {
          setError(e.message)
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

  const handleToggleQR = () => setShowQR((prev) => !prev)

  const handleCopy = () => Clipboard.setString(transferHash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${transferHash}`)

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity('TRBTC', 0.1)]}
      style={styles.parent}>
      <ScrollView>
        {showQR && <View
          style={styles.cameraContainer}>
          <View style={styles.cameraFrame}>
            <QRScanner
              onBarCodeRead={(event) => {
                const data = decodeURIComponent(event.data)
                setDisplayTo(data)
                setTo(data)
              }} />
          </View>
        </View>}
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
            onToggleQR={handleToggleQR}
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
            <TransactionInfo
              hash={transferHash}
              selectedToken={selectedSymbol}
              handleCopy={handleCopy}
              handleOpen={handleOpen}
            />
          )}
          {!!tx && (
            <TransactionInfo
              hash={tx.transactionHash}
              selectedToken={selectedSymbol}
              handleCopy={handleCopy}
              handleOpen={handleOpen}
            />
          )}
          {!!error && <View style={styles.centerRow}>
            <SquareButton
              onPress={async () => {
                await transfer(selectedSymbol)
              }}
              title="Retry"
              testID="Transfer.RetryButton"
              icon={<RefreshIcon color={getTokenColor(selectedSymbol)} />}
            />
          </View>}
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    width: '100%',
  },
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
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },
  cameraFrame: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    marginVertical: 40,
    padding: 20,
    borderRadius: 20,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
  }
})
