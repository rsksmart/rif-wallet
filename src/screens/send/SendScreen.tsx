import React, { useState } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { useSocketsState } from '../../subscriptions/RIFSockets'

import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import { colors } from '../../styles'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import WalletNotDeployedView from './WalletNotDeployedModal'
import { pollTransaction, sendTransaction } from './operations'
import { transactionInfo, TransactionStatus } from './types'
import { WaitingOnUserScreen } from './WaitingOnUserScreen'
import { MediumText } from '../../components'
import TransactionInfo from './TransactionInfo'

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

  const defaultTransactin = { status: TransactionStatus.NONE }
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
      token,
      amount: parseInt(amount, 10),
      to,
      status: TransactionStatus.USER_CONFRIM,
      network,
    })

    sendTransaction(wallet, chainId, token, to, amount)
      .then((hash: string) => {
        setCurrentTransaction({
          ...currentTransaction,
          status: TransactionStatus.PENDING,
          hash,
        })

        pollTransaction(wallet, hash).then((success: boolean) =>
          setCurrentTransaction({
            ...currentTransaction,
            status: success
              ? TransactionStatus.SUCCESS
              : TransactionStatus.FAILED,
          }),
        )
      })
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
  return (
    <TransactionInfo transaction={currentTransaction} />
  )
  }

  return (
    <View style={styles.parent}>
      <ScrollView>
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
        {!!error && (
          <MediumText style={styles.error}>{error.message}</MediumText>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    display: 'flex',
    height: '100%',
  },
  error: {
    marginTop: 10,
    color: colors.orange,
    textAlign: 'center',
  },
})
