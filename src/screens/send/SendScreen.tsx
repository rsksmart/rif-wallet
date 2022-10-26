import React, { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { useSocketsState } from '../../subscriptions/RIFSockets'
import { ScreenProps } from '../../RootNavigation'
import { ScreenWithWallet } from '../types'
import TransactionInfo from './TransactionInfo'
import { colors } from '../../styles'
import TransactionForm from './TransactionForm'
import WalletNotDeployedView from './WalletNotDeployedModal'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import {
  usePaymentExecutor,
  PaymentExecutorContext,
} from './usePaymentExecutor'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'
import { MixedTokenAndNetworkType } from './types'
import { ITokenWithBalance } from '../../lib/rifWalletServices/RIFWalletServicesTypes'

export const SendScreen: React.FC<ScreenProps<'Send'> & ScreenWithWallet> = ({
  route,
  wallet,
  isWalletDeployed,
  navigation,
}) => {
  const assets =
    useFetchBitcoinNetworksAndTokens() as unknown as MixedTokenAndNetworkType[]

  const { state } = useSocketsState()
  const contractAddress =
    route.params?.contractAddress || Object.keys(state.balances)[0]

  const [chainId, setChainId] = useState<number>(31)

  const {
    currentTransaction,
    error,
    executePayment,
    setUtxos,
    setBitcoinBalance,
  } = usePaymentExecutor()

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const onExecuteTransfer = (
    token: ITokenWithBalance | BitcoinNetwork,
    amount: string,
    to: string,
  ) => {
    executePayment({
      token,
      amount,
      to,
      wallet,
      chainId,
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
        <PaymentExecutorContext.Provider
          value={{
            setUtxosGlobal: setUtxos,
            setBitcoinBalanceGlobal: setBitcoinBalance,
          }}>
          <TransactionForm
            onConfirm={onExecuteTransfer}
            tokenList={assets}
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
        </PaymentExecutorContext.Provider>
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
