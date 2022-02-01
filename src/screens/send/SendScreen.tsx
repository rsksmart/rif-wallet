import React, { useEffect, useState } from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { useIsFocused } from '@react-navigation/native'

import {
  StyleSheet,
  View,
  TextInput,
  Linking,
  TouchableOpacity,
  ScrollView,
  Text,
} from 'react-native'

import { ContractReceipt, BigNumber, utils, ContractTransaction } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import { getAllTokens } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { AddressInput } from '../../components'
import { getTokenColor, getTokenColorWithOpacity } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, RefreshIcon } from '../../components/icons'
import { TokenImage } from '../home/TokenImage'
import Clipboard from '@react-native-community/clipboard'
import TransactionInfo from './TransactionInfo'

import { balanceToString } from '../balances/BalancesScreen'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet, navigation }) => {
  const isFocused = useIsFocused()
  const { state } = useSocketsState()

  const contractAddress = route.params?.contractAddress as string
  const selectedTokenInfo = state.balances[contractAddress]
  const selectedTokenBalance = balanceToString(
    selectedTokenInfo.balance,
    selectedTokenInfo.decimals || 0,
  )
  const tokenQuota = state.prices[contractAddress].price

  const { t } = useTranslation()

  const [availableTokens, setAvailableTokens] = useState<IToken[]>()
  const [selectedSymbol, setSelectedSymbol] = useState(
    selectedTokenInfo.symbol || 'tRIF',
  )

  const [amount, setAmount] = useState('')
  const [to, setTo] = useState(route.params?.to || '')

  const [tx, setTx] = useState<ContractTransaction>()
  const [receipt, setReceipt] = useState<ContractReceipt>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    setTo(route.params?.to || '')

    if (tx && receipt) {
      setTx(undefined)
      setReceipt(undefined)
    }

    getAllTokens(wallet).then(tokens => setAvailableTokens(tokens))
  }, [wallet, isFocused])

  const transfer = async () => {
    setTx(undefined)
    setReceipt(undefined)
    setError(undefined)

    if (availableTokens) {
      const token = availableTokens.find(
        token => token.symbol === selectedSymbol,
      )
      if (token) {
        try {
          const decimals = await token.decimals()
          const tokenAmount = BigNumber.from(utils.parseUnits(amount, decimals))

          const transferTx = await token.transfer(to.toLowerCase(), tokenAmount)

          setTx(transferTx)

          const transferReceipt = await transferTx.wait()

          setReceipt(transferReceipt)
        } catch (e: any) {
          setError(e.message)
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

  const handleTargetAddressChange = (address: string) => {
    setError(undefined)
    setTo(address)
  }

  const imageStyle = {
    ...styles.image,
    shadowColor: '#000000',
  }

  const handleCopy = () => Clipboard.setString(tx!.hash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${tx!.hash}`)

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedSymbol, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <View>
          <Text>Balance: {`${selectedTokenBalance}`}</Text>
          <Text>USD: { (Number(selectedTokenBalance) * tokenQuota).toFixed(2) || 'N/A'}</Text>
        </View>
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
            {!!amount && (
              <Text>{(Number(amount) * tokenQuota).toFixed(2) || 'N/A'} USD</Text>
            )}
          </View>
        </View>
        <View>
          <AddressInput
            initialValue={route.params?.to || ''}
            onChangeText={handleTargetAddressChange}
            testID={'To.Input'}
            navigation={navigation}
            showContactsIcon={true}
            chainId={31}
            color={getTokenColor(selectedSymbol)}
          />
        </View>

        <View style={styles.centerRow}>
          <SquareButton
            disabled={!!tx && !receipt}
            onPress={transfer}
            title="Next"
            testID="Address.CopyButton"
            icon={<Arrow color={getTokenColor(selectedSymbol)} rotate={90} />}
          />
        </View>
        <View style={styles.section}>
          {!!tx && (
            <TransactionInfo
              hash={tx.hash}
              info={
                !receipt
                  ? t('Transaction Sent. Please wait...')
                  : t('Transaction Confirmed.')
              }
              selectedToken={selectedSymbol}
              handleCopy={handleCopy}
              handleOpen={handleOpen}
            />
          )}
          {!!error && (
            <View style={styles.centerRow}>
              <Text>{t('An error ocurred')}</Text>
              <SquareButton
                onPress={transfer}
                title="Retry"
                testID="Transfer.RetryButton"
                icon={<RefreshIcon color={getTokenColor(selectedSymbol)} />}
              />
            </View>
          )}
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
  },
})
