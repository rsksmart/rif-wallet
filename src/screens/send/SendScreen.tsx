import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { BigNumber, utils, ContractTransaction } from 'ethers'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import {
  convertToERC20Token,
  makeRBTCToken,
} from '../../lib/token/tokenMetadata'
import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo, { transactionInfo } from './TransactionInfo'
import { colors } from '../../styles'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import WalletNotDeployedView from './WalletNotDeployedModal'

export const SendScreen: React.FC<ScreenProps<'Send'> & ScreenWithWallet> = ({
  route,
  wallet,
  isWalletDeployed,
  navigation,
}) => {
  const { state } = useSocketsState()
  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]
  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<Error>()
  const [chainId, setChainId] = useState<number>(31)

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const transfer = (token: ITokenWithBalance, amount: string, to: string) => {
    setError(undefined)
    setCurrentTransaction({ status: 'USER_CONFIRM' })

    // handle both ERC20 tokens and the native token (gas)
    const transferMethod =
      token.symbol === 'TRBTC'
        ? makeRBTCToken(wallet, chainId)
        : convertToERC20Token(token, {
            signer: wallet,
            chainId,
          })

    transferMethod.decimals().then((decimals: number) => {
      const tokenAmount = BigNumber.from(utils.parseUnits(amount, decimals))

      transferMethod
        .transfer(to.toLowerCase(), tokenAmount)
        .then((txPending: ContractTransaction) => {
          const current: transactionInfo = {
            to,
            value: amount,
            symbol: transferMethod.symbol,
            hash: txPending.hash,
            status: 'PENDING',
          }
          setCurrentTransaction(current)

          txPending
            .wait()
            .then(() =>
              setCurrentTransaction({ ...current, status: 'SUCCESS' }),
            )
            .catch(() =>
              setCurrentTransaction({ ...current, status: 'FAILED' }),
            )
        })
        .catch((err: any) => {
          setError(err)
          setCurrentTransaction(null)
        })
    })
  }

  const onDeployWalletNavigate = () =>
    navigation.navigate('ManuallyDeployScreen' as any)
  return (
    <ScrollView style={styles.parent}>
      {!isWalletDeployed && (
        <WalletNotDeployedView onDeployWalletPress={onDeployWalletNavigate} />
      )}
      {!currentTransaction ? (
        <TransactionForm
          onConfirm={transfer}
          tokenList={Object.values(state.balances)}
          tokenPrices={state.prices}
          chainId={chainId}
          initialValues={{
            recipient: route.params?.to,
            amount: '0',
            asset: route.params?.contractAddress
              ? state.balances[route.params.contractAddress]
              : state.balances[contractAddress],
          }}
          transactions={state.transactions.activityTransactions}
        />
      ) : (
        <TransactionInfo transaction={currentTransaction} />
      )}

      {!!error && <Text style={styles.error}>{error.message}</Text>}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.darkPurple3,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  error: {
    marginTop: 10,
    color: colors.orange,
    textAlign: 'center',
  },
})
