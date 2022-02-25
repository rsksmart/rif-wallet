import React, { useEffect, useState } from 'react'
import { useIsFocused } from '@react-navigation/native'

import { StyleSheet, View, ScrollView, Text } from 'react-native'

import { BigNumber, utils, ContractTransaction } from 'ethers'
import { useTranslation } from 'react-i18next'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo from './TransactionInfo'

import { colors } from '../../styles/colors'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet }) => {
  const isFocused = useIsFocused()
  const { state } = useSocketsState()
  const { t } = useTranslation()

  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [selectedToken, setSelectedToken] = React.useState<ITokenWithBalance>()

  // response:
  const [currentTransaction, setCurrentTransaction] = useState<any>({
    to: '0xFCcA8a451857bdE6b26994534A0AC6aB4fB47A4e',
    value: '1',
    symbol: 'DOC',
    status: 'PENDING',
    hash: '0x437596a5f97d5c2a48a0cef5db8a09f09d867cd16b3e2e9ee8277c3a085a0bc6'
  })
  const [error, setError] = useState<string>()
  const chainId = 31 // @todo

  useEffect(() => {
    if (route.params?.contractAddress) {
      setSelectedToken(state.balances[route.params.contractAddress])
    } else {
      setSelectedToken(state.balances[contractAddress])
    }
  }, [wallet, isFocused])

  const transfer = async (bundle: {
    to: string
    amount: string
    tokenAddress: string
  }) => {
    setIsLoading(true)

    // handle both ERC20 tokens and gas
    const transferMethod =
      bundle.tokenAddress === '0x0000000000000000000000000000000000000000'
        ? makeRBTCToken(wallet, chainId)
        : convertToERC20Token(state.balances[bundle.tokenAddress], {
            signer: wallet,
            chainId,
          })

    transferMethod.decimals().then((decimals: number) => {
      const tokenAmount = BigNumber.from(
        utils.parseUnits(bundle.amount, decimals),
      )

      transferMethod
        .transfer(bundle.to.toLowerCase(), tokenAmount)
        .then((txPending: ContractTransaction) => {
          // setTx(txPending)
          // save transaction type to be used on transactionInfo screen
          setCurrentTransaction({
            to: bundle.to,
            amount: bundle.amount, //save amount before decimals
            logo: transferMethod.logo,
            hash: txPending.hash,
          })
          setIsLoading(false)
        })
        .catch((err: any) => {
          setIsLoading(false)
          setError(err)
        })
    })
  }

  if (isLoading || !selectedToken) {
    return (
      <View style={styles.parent}>
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.parent}>
      {!currentTransaction ? (
        <TransactionForm
          onConfirm={transfer}
          tokenList={Object.values(state.balances)}
          tokenPrices={state.prices}
          chainId={chainId}
          initialValues={{
            recipient: route.params?.to,
            amount: '0',
            asset: selectedToken,
          }}
        />
      ) : (
        <TransactionInfo transaction={currentTransaction} />
      )}

      {!!error && (
        <View style={styles.centerRow}>
          <Text>{t('An error ocurred')}</Text>
        </View>
      )}
    </ScrollView>
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
