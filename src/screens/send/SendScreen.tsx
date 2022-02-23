import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { StyleSheet, View, Linking, ScrollView, Text } from 'react-native'

import { ContractReceipt, BigNumber, utils, ContractTransaction } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import { convertToERC20Token } from '../../lib/token/tokenMetadata'
import { IToken } from '../../lib/token/BaseToken'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { getTokenColor } from '../home/tokenColor'
import { SquareButton } from '../../components/button/SquareButton'
import { RefreshIcon } from '../../components/icons'
import Clipboard from '@react-native-community/clipboard'
import TransactionInfo from './TransactionInfo'

import { colors } from '../../styles/colors'
import { LoadingScreen } from '../../core/components/LoadingScreen'
import TransactionForm from './TransactionForm'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet }) => {
  const isFocused = useIsFocused()
  const { state } = useSocketsState()

  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  // @jesse GOOD variables:
  const [selectedToken, setSelectedToken] = React.useState(
    state.balances[contractAddress],
  )
  const tokensWithBalance = Object.values(state.balances) // ITokenWithBalance[]
  const tokenQuote = state.prices[selectedToken.contractAddress]?.price

  const [availableTokens, setAvailableTokens] = useState<IToken[]>()

  const { t } = useTranslation()

  const [amount, setAmount] = useState<number>(0)
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

    // const tokensWithBalance = Object.values(state.balances)

    const chainId = 31 // Once https://github.com/rsksmart/swallet/pull/151 gets approved we´ll need to use it from the state

    // @jesse - this is not needed at this point, do not convert here!
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

  const handleCopy = () => Clipboard.setString(tx!.hash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${tx!.hash}`)

  if (!selectedToken || !availableTokens) {
    return <LoadingScreen reason="Gettin' tokens..." />
  }

  return (
    <View style={styles.parent}>
      <ScrollView>
        <TransactionForm
          onConfirm={transfer}
          tokenList={Object.values(state.balances)}
          tokenPrices={state.prices}
          chainId={31}
          initialValues={{
            recipient: route.params?.to,
            amount: 0,
            assetAddress: route.params?.contractAddress,
          }}
        />

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
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.darkBlue,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  label: {
    color: colors.white,
    marginBottom: 5,
  },

  chooseAsset: {
    width: '100%',
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

  section: {
    marginTop: 5,
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    flex: 1,
  },
})
