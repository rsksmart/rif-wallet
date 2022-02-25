import React, { useEffect, useState } from 'react'
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native'
import { BigNumber, utils, ContractTransaction } from 'ethers'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo, { transactionInfo } from './TransactionInfo'

import { colors } from '../../styles/colors'
import TransactionForm from './TransactionForm'

export type SendScreenProps = {}

export const SendScreen: React.FC<
  SendScreenProps & ScreenProps<'Send'> & ScreenWithWallet
> = ({ route, wallet }) => {
  const { state } = useSocketsState()

  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  const selectedToken = route.params?.contractAddress
    ? state.balances[route.params.contractAddress]
    : state.balances[contractAddress]

  const [transactionStatus, setTransactionStatus] = useState<
    'NONE' | 'PENDING' | 'SUCCESS' | 'FAILED'
  >('NONE')
  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<string>()

  const [chainId, setChainId] = useState<number>()
  // const chainId = wallet.getChainId()

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const transfer = async (bundle: {
    to: string
    amount: string
    tokenAddress: string
  }) => {
    setError(undefined)
    setTransactionStatus('PENDING')

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
          // save transaction for the info screen
          setCurrentTransaction({
            to: bundle.to,
            value: bundle.amount,
            symbol: transferMethod.symbol,
            hash: txPending.hash,
          })

          txPending
            .wait()
            .then(() => setTransactionStatus('SUCCESS'))
            .catch(() => setTransactionStatus('FAILED'))
        })
        .catch((err: any) => {
          setError(err)
          setTransactionStatus('NONE')
          setCurrentTransaction(null)
        })
    })
  }

  if (transactionStatus === 'PENDING') {
    return (
      <View style={styles.parent}>
        <Image
          source={require('../../images/transferWait.png')}
          style={styles.loading}
        />
        <Text style={styles.loadingReason}>
          {transactionStatus === 'PENDING' ? 'transfering ...' : 'loading...'}
        </Text>
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
        <TransactionInfo
          transaction={currentTransaction}
          status={transactionStatus}
        />
      )}

      {!!error && <Text style={styles.error}>{error}</Text>}
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
  loading: {
    alignSelf: 'center',
    marginTop: '25%',
    marginBottom: 10,
  },
  loadingReason: {
    textAlign: 'center',
    color: colors.white,
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
  error: {
    marginTop: 10,
    color: colors.orange,
    textAlign: 'center',
  },
})
