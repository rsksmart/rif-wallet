import { useCallback, useEffect, useState } from 'react'
import { KeyboardAvoidingView, Platform } from 'react-native'
import { BitcoinNetworkWithBIPRequest } from '@rsksmart/rif-wallet-bitcoin'

import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { selectBalances } from 'src/redux/slices/balancesSlice/selectors'
import { sharedStyles } from 'shared/constants'
import { ITokenOrBitcoinWithBIPRequest } from 'screens/send/types'

import { ScreenWithWallet } from '../types'
import { TransactionInfo } from './TransactionInfo'
import { TransactionForm } from './TransactionForm'
import WalletNotDeployedView from './WalletNotDeployedModal'
import { usePaymentExecutor } from './usePaymentExecutor'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'

export const SendScreen = ({
  route,
  wallet,
  isWalletDeployed,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Send> & ScreenWithWallet) => {
  const assets = useFetchBitcoinNetworksAndTokens()

  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)
  const backAction = route.params.backAction
  const contractAddress =
    route.params?.contractAddress || Object.keys(tokenBalances)[0]

  const [chainId, setChainId] = useState<number>(31)
  // We assume only one bitcoinNetwork instance exists
  const { currentTransaction, executePayment } = usePaymentExecutor(
    assets.find(asset => 'bips' in asset) as BitcoinNetworkWithBIPRequest,
  )

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const onExecuteTransfer = (
    token: ITokenOrBitcoinWithBIPRequest,
    amount: number,
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
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {!isWalletDeployed && (
        <WalletNotDeployedView onDeployWalletPress={onDeployWalletNavigate} />
      )}
      {!currentTransaction ? (
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
        />
      ) : (
        <TransactionInfo transaction={currentTransaction} />
      )}
    </KeyboardAvoidingView>
  )
}
