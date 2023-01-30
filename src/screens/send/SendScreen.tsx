import { useCallback, useEffect, useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'

import { ITokenWithBalance } from 'lib/rifWalletServices/RIFWalletServicesTypes'

import { RegularText } from 'src/components'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { colors } from 'src/styles'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'

import { ScreenWithWallet } from '../types'
import { TransactionInfo } from './TransactionInfo'
import { TransactionForm } from './TransactionForm'
import WalletNotDeployedView from './WalletNotDeployedModal'
import {
  usePaymentExecutor,
  PaymentExecutorContext,
} from './usePaymentExecutor'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'
import { MixedTokenAndNetworkType } from './types'

export const SendScreen = ({
  route,
  wallet,
  isWalletDeployed,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Send> & ScreenWithWallet) => {
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
    () => navigation.navigate(homeStackRouteNames.RelayDeployScreen),
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

        {!!error && (
          <RegularText style={styles.error}>{error.message}</RegularText>
        )}
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
