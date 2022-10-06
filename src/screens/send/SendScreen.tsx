import React, { useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'

import TransactionInfo, { transactionInfo } from './TransactionInfo'
import { colors } from '../../styles'
import TransactionForm from './TransactionForm'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'
import WalletNotDeployedView from './WalletNotDeployedModal'

interface Interface {
  isWalletDeployed: boolean
  navigateToDeploySceen: () => void
  handleTransfer: (token: any, amount: string, to: string) => Promise<string>
  balances: ITokenWithBalance[]
  prices: any
  transactions: any
  chainId: number
}

export const SendScreen: React.FC<Interface> = ({
  isWalletDeployed,
  navigateToDeploySceen,
  handleTransfer,
  balances,
  prices,
  transactions,
  chainId,
}) => {
  const [currentTransaction, setCurrentTransaction] =
    useState<transactionInfo | null>(null)
  const [error, setError] = useState<Error>()

  return (
    <ScrollView style={styles.parent}>
      {!isWalletDeployed && (
        <WalletNotDeployedView onDeployWalletPress={navigateToDeploySceen} />
      )}
      {!currentTransaction ? (
        <TransactionForm
          onConfirm={handleTransfer}
          tokenList={Object.values(balances)}
          tokenPrices={prices}
          chainId={chainId}
          initialValues={{
            recipient: '', // @jesse todo
            amount: '0',
            asset: balances[0], // @jesse todo
          }}
          transactions={transactions.activityTransactions}
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
