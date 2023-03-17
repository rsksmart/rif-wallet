import { useCallback, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { BitcoinNetwork } from '@rsksmart/rif-wallet-bitcoin'
import { ITokenWithBalance } from '@rsksmart/rif-wallet-services'

import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { selectTransactions } from 'store/slices/transactionsSlice/selectors'
import { sharedStyles } from 'shared/constants'

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
  const backAction = route.params.backAction
  const contractAddress =
    route.params?.contractAddress || Object.keys(tokenBalances)[0]

  const [chainId, setChainId] = useState<number>(31)

  const { currentTransaction, executePayment, setUtxos, setBitcoinBalance } =
    usePaymentExecutor()

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const onExecuteTransfer = (
    token: ITokenWithBalance | BitcoinNetwork,
    amount: string,
    to: string,
  ) => {
    backAction()
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
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
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
            onCancel={backAction}
            tokenList={assets}
            tokenPrices={prices}
            chainId={chainId}
            initialValues={{
              recipient: route.params?.to,
              amount: 0,
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
    </KeyboardAvoidingView>
  )
}
