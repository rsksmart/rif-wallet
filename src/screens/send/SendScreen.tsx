import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import {
  StyleSheet,
  View,
  TextInput,
  Linking,
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
import { getTokenColor } from '../home/tokenColor'
import { grid } from '../../styles/grid'
import { SquareButton } from '../../components/button/SquareButton'
import { Arrow, RefreshIcon } from '../../components/icons'
import Clipboard from '@react-native-community/clipboard'
import TransactionInfo from './TransactionInfo'

import { balanceToString } from '../balances/BalancesScreen'
import { colors } from '../../styles/colors'
import AssetChooser from './AssetChooser'
import { LoadingScreen } from '../../core/components/LoadingScreen'
import SetAmountComponent from './SetAmountComponent'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet, navigation }) => {
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

  // @jesse UNKNOWN variables:
  const [availableTokens, setAvailableTokens] = useState<IToken[]>()

  /*
  const selectedTokenBalance = balanceToString(
    selectedToken.balance,
    selectedToken.decimals || 0,
  )
  
  */

  const { t } = useTranslation()

  const [amount, setAmount] = useState<string>('')
  const [to, setTo] = useState(route.params?.to || '')

  const [tx, setTx] = useState<ContractTransaction>()
  const [receipt, setReceipt] = useState<ContractReceipt>()
  const [error, setError] = useState<string>()
  const [validationError, setValidationError] = useState(false)

  const handleTokenSelection = (token: ITokenWithBalance) => setSelectedToken(token)

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

  const handleTargetAddressChange = (address: string) => {
    setError(undefined)
    setTo(address)
  }

  const handleCopy = () => Clipboard.setString(tx!.hash!)
  const handleOpen = () =>
    Linking.openURL(`https://explorer.testnet.rsk.co/tx/${tx!.hash}`)

  const isNextDisabled = (!!tx && !receipt) || validationError

  if (!selectedToken || !availableTokens) {
    return <LoadingScreen reason="Gettin' tokens..." />
  }

  return (
    <View style={styles.parent}>
      <ScrollView>
        <View style={grid.row}>
          <View style={grid.column5}>
            <Text style={styles.label}>choose asset</Text>
            <AssetChooser
              selectedToken={selectedToken}
              tokenList={Object.values(state.balances)}
              handleTokenSelection={handleTokenSelection}
            />
          </View>
          <View style={{ ...grid.column7, ...grid.offset1 }}>
            <Text style={styles.label}>set amount</Text>
            <SetAmountComponent
              setAmount={setAmount}
              token={selectedToken}
              usdAmount={tokenQuote}
            />
          </View>
        </View>
        <View>
          <Text style={styles.label}>choose recipient</Text>
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
    // height: 50,
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
