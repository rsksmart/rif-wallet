import React, { useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo from './TransactionInfo'
import { colors } from '../../styles'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import WalletNotDeployedView from './WalletNotDeployedModal'
import { sendTransaction } from './operations'
import { transactionInfo, TransactionStatus } from './types'
import { WaitingOnUserScreen } from './WaitingOnUserScreen'

export const SendScreen: React.FC<ScreenProps<'Send'> & ScreenWithWallet> = ({
  route,
  wallet,
  chainId,
  isWalletDeployed,
  navigation,
}) => {
  const { state } = useSocketsState()
  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  const defaultTransactin = { status: TransactionStatus.USER_CONFRIM }
  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo>(defaultTransactin)
  const [error, setError] = useState<Error>()

  const handleTransfer = (
    token: ITokenWithBalance,
    amount: string,
    to: string,
  ) => {
    const network = token.symbol === 'TBTC' ? 'TBTC' : 'TRSK'
    setError(undefined)

    setCurrentTransaction({
      status: TransactionStatus.USER_CONFRIM,
      network,
    })

    sendTransaction(wallet, chainId, token, to, amount)
      .then((hash: string) =>
        setCurrentTransaction({
          status: TransactionStatus.PENDING,
          hash,
          network,
        }),
      )
      .catch((sendError: Error) => {
        setError(sendError)
        setCurrentTransaction(defaultTransactin)
      })
  }

  const onDeployWalletNavigate = () =>
    navigation.navigate('ManuallyDeployScreen' as any)

  if (!isWalletDeployed) {
    return (
      <WalletNotDeployedView onDeployWalletPress={onDeployWalletNavigate} />
    )
  }

  if (currentTransaction?.status === TransactionStatus.USER_CONFRIM) {
    return <WaitingOnUserScreen />
  }

  if (currentTransaction?.status === TransactionStatus.PENDING) {
    // return <TransactionInfo transaction={currentTransaction} />
  }

  return (
    <ScrollView style={styles.parent}>
      <TransactionForm
        onConfirm={handleTransfer}
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
