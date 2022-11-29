import { useEffect, useState } from 'react'
import { StyleSheet, ScrollView, Text } from 'react-native'
import { RootStackScreenProps } from 'navigation/rootNavigator/types'
import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import { ScreenWithWallet } from '../types'
import { TransactionInfo } from './TransactionInfo'
import { colors } from '../../styles'
import { TransactionForm } from './TransactionForm'
import WalletNotDeployedView from './WalletNotDeployedModal'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import {
  usePaymentExecutor,
  PaymentExecutorContext,
} from './usePaymentExecutor'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'
import { MixedTokenAndNetworkType } from './types'
import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeHooks'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'

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

  const onDeployWalletNavigate = () =>
    navigation.navigate(rootStackRouteNames.ManuallyDeployScreen)

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
            tokenPrices={prices}
            chainId={chainId}
            initialValues={{
              recipient: route.params?.to,
              amount: '0',
              asset: route.params?.contractAddress
                ? tokenBalances[route.params.contractAddress]
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
