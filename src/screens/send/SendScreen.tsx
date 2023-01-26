import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { useCallback, useEffect, useState } from 'react'
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
} from 'react-native'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { colors } from 'src/styles'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import { ScreenWithWallet } from '../types'
import { TransactionForm } from './TransactionForm'
import { TransactionInfo } from './TransactionInfo'
import { MixedTokenAndNetworkType } from './types'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'
import {
  PaymentExecutorContext,
  usePaymentExecutor,
} from './usePaymentExecutor'
import WalletNotDeployedView from './WalletNotDeployedModal'

export const SendScreen = ({
  route,
  wallet,
  isWalletDeployed,
  navigation,
}: RootStackScreenProps<rootStackRouteNames.Send> & ScreenWithWallet) => {
  const assets =
    useFetchBitcoinNetworksAndTokens() as unknown as MixedTokenAndNetworkType[]

  const { transactions } = useAppSelector(selectTransactions)
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const contractAddress =
    route.params?.contractAddress || Object.keys(tokenBalances)[0]

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

  const onDeployWalletNavigate = useCallback(
    () => navigation.navigate(rootStackRouteNames.RelayDeployScreen),
    [navigation],
  )

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
              tokenPrices={prices}
              chainId={chainId}
              initialValues={{
                recipient: route.params?.to,
                amount: '0',
                asset: route.params?.contractAddress
                  ? assets.find(
                      asset =>
                        asset.contractAddress === route.params?.contractAddress,
                    )
                  : tokenBalances[contractAddress],
              }}
              transactions={transactions}
            />
          </PaymentExecutorContext.Provider>
        ) : (
          <TransactionInfo transaction={currentTransaction} />
        )}

        {!!error && <Text style={styles.error}>{error.message}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
  },
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
