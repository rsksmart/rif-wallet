import React, { useEffect, useState } from 'react'
import { LinearGradient } from '../../components/linearGradient/LinearGradient'
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

import { convertToERC20Token } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

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
import MiniModal from '../../components/tokenSelector/MiniModal'

import { balanceToString } from '../balances/BalancesScreen'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet, navigation }) => {
  const isFocused = useIsFocused()
  const { state } = useSocketsState()

  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]
  const [selectedToken, setSelectedToken] = React.useState(
    state.balances[contractAddress],
  )

  const [availableTokens, setAvailableTokens] = useState<IToken[]>()

  const selectedTokenBalance = balanceToString(
    selectedToken.balance,
    selectedToken.decimals || 0,
  )
  const tokenQuota = state.prices[selectedToken.contractAddress]?.price

  const { t } = useTranslation()

  const [amount, setAmount] = useState('')
  const [to, setTo] = useState(route.params?.to || '')

  const [tx, setTx] = useState<ContractTransaction>()
  const [receipt, setReceipt] = useState<ContractReceipt>()
  const [error, setError] = useState<string>()
  const [validationError, setValidationError] = useState(false)
  const [showSelector, setShowSelector] = useState(false)

  const handleTokenSelection = (token: ITokenWithBalance) => {
    setShowSelector(false)
    setSelectedToken(token)
  }

  const openTokenSelector = () => {
    setShowSelector(true)
  }

  useEffect(() => {
    setTo(route.params?.to || '')

    if (tx && receipt) {
      setTx(undefined)
      setReceipt(undefined)
    }

    const tokensWithBalance = Object.values(state.balances)

    const chainId = 31 // Once https://github.com/rsksmart/swallet/pull/151 gets approved we´ll need to use it from the state

    const tokens: Array<IToken> = tokensWithBalance.map(token =>
      convertToERC20Token(token, { signer: wallet, chainId }),
    )

    setAvailableTokens(tokens)
  }, [wallet, isFocused])

  const transfer = async () => {
    setTx(undefined)
    setReceipt(undefined)
    setError(undefined)

    if (availableTokens) {
      const token = availableTokens.find(
        _token => _token.symbol === selectedToken.symbol,
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

  const handleTargetAddressChange = (address: string) => {
    setError(undefined)
    setTo(address)
  }

  const handleAmountChange = (currentAmount: string) => {
    if (Number(currentAmount) > Number(selectedTokenBalance)) {
      setValidationError(true)
      setAmount(currentAmount)
      return
    }
    setValidationError(false)
    setAmount(currentAmount)
  }

  const imageStyle = {
    ...styles.image,
    shadowColor: '#000000',
  }

  const handleCopy = () => Clipboard.setString(tx!.hash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${tx!.hash}`)

  const isNextDisabled = (!!tx && !receipt) || validationError

  return (
    <LinearGradient
      colors={['#FFFFFF', getTokenColorWithOpacity(selectedToken.symbol, 0.1)]}
      style={styles.parent}>
      <ScrollView>
        <View>
          <Text>
            Balance: {`${selectedTokenBalance} ${selectedToken.symbol}`}
          </Text>
          <Text>
            USD:{' '}
            {(Number(selectedTokenBalance) * tokenQuota).toFixed(2) || 'N/A'}
          </Text>
        </View>
        <View style={grid.row}>
          <View style={{ ...grid.column2, ...styles.icon }}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => openTokenSelector()}>
              <View style={imageStyle}>
                <TokenImage
                  symbol={selectedToken.symbol}
                  height={30}
                  width={30}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View style={{ ...grid.column10 }}>
            <TextInput
              style={styles.input}
              onChangeText={text => handleAmountChange(text)}
              value={amount}
              placeholder={t('Amount')}
              keyboardType="numeric"
              testID={'Amount.Input'}
            />
            {!!amount && (
              <Text>
                {(Number(amount) * tokenQuota).toFixed(2) || 'N/A'} USD
              </Text>
            )}
            {validationError && <Text>Insuficient funds</Text>}
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
            color={getTokenColor(selectedToken.symbol)}
          />
        </View>

        <View style={styles.centerRow}>
          <SquareButton
            disabled={isNextDisabled}
            onPress={transfer}
            title="Next"
            testID="Address.CopyButton"
            icon={
              <Arrow color={getTokenColor(selectedToken.symbol)} rotate={90} />
            }
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
              selectedToken={selectedToken.symbol}
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
                icon={
                  <RefreshIcon color={getTokenColor(selectedToken.symbol)} />
                }
              />
            </View>
          )}
        </View>
      </ScrollView>
      {showSelector && (
        <MiniModal
          onTokenSelection={handleTokenSelection}
          availableTokens={Object.values(state.balances)}
        />
      )}
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
