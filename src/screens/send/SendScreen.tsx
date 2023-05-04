import { useCallback, useEffect, useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'

import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { settingsStackRouteNames } from 'navigation/settingsNavigator/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import { selectTotalUsdValue } from 'store/slices/balancesSlice/selectors'
import { sharedStyles } from 'shared/constants'
import { ITokenOrBitcoinWithBIPRequest } from 'screens/send/types'

import { ScreenWithWallet } from '../types'
import { TransactionInfo } from './TransactionInfo'
import { TransactionForm } from './TransactionForm'
import { usePaymentExecutor } from './usePaymentExecutor'
import { useFetchBitcoinNetworksAndTokens } from './useFetchBitcoinNetworksAndTokens'

export const SendScreen = ({
  route,
  wallet,
  walletDeployed,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Send> & ScreenWithWallet) => {
  const { t } = useTranslation()
  const { loading, isDeployed } = walletDeployed
  const assets = useFetchBitcoinNetworksAndTokens()

  const totalUsdBalance = useAppSelector(selectTotalUsdValue)
  const prices = useAppSelector(selectUsdPrices)
  const backAction = route.params?.backAction
  const contractAddress = route.params?.contractAddress || assets[0]

  const [chainId, setChainId] = useState<number>(31)
  // We assume only one bitcoinNetwork instance exists
  const { currentTransaction, executePayment } = usePaymentExecutor(
    assets.find(asset => 'bips' in asset),
  )

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const onExecuteTransfer = useCallback(
    (token: ITokenOrBitcoinWithBIPRequest, amount: number, to: string) => {
      executePayment({
        token,
        amount,
        to,
        wallet,
        chainId,
      })
    },
    [chainId, executePayment, wallet],
  )

  useEffect(() => {
    if (!isDeployed && !loading) {
      navigation.navigate(rootTabsRouteNames.Settings, {
        screen: settingsStackRouteNames.RelayDeployScreen,
        params: {
          goBackScreen: {
            parent: rootTabsRouteNames.Home,
            child: homeStackRouteNames.Send,
          },
        },
      })
    }
  }, [isDeployed, loading, navigation])

  useEffect(() => {
    if (loading) {
      Alert.alert(
        t('wallet_deploy_deploying_alert_title'),
        t('wallet_deploy_deploying_alert_body'),
      )
    }
  }, [loading, t])

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {!currentTransaction ? (
        <TransactionForm
          onConfirm={onExecuteTransfer}
          onCancel={backAction}
          tokenList={assets}
          totalUsdBalance={totalUsdBalance}
          tokenPrices={prices}
          chainId={chainId}
          isWalletDeployed={walletDeployed.isDeployed}
          initialValues={{
            recipient: route.params?.to,
            amount: 0,
            asset: assets.find(
              asset => asset.contractAddress === contractAddress,
            ),
          }}
        />
      ) : (
        <TransactionInfo transaction={currentTransaction} />
      )}
    </KeyboardAvoidingView>
  )
}
