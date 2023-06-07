import { useCallback, useEffect, useState } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'

import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { settingsStackRouteNames } from 'navigation/settingsNavigator/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppSelector } from 'store/storeUtils'
import {
  selectBalances,
  selectTotalUsdValue,
} from 'store/slices/balancesSlice/selectors'
import { sharedStyles } from 'shared/constants'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'

import { ScreenWithWallet } from '../types'
import { TransactionForm } from './TransactionForm'
import { usePaymentExecutor } from './usePaymentExecutor'
import { CongratulationsComponent } from './CongratulationsComponent'

export const SendScreen = ({
  route,
  wallet,
  walletDeployed,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Send> & ScreenWithWallet) => {
  const { t } = useTranslation()
  const { loading, isDeployed } = walletDeployed
  const assets = Object.values(useAppSelector(selectBalances))

  const totalUsdBalance = useAppSelector(selectTotalUsdValue)
  const prices = useAppSelector(selectUsdPrices)
  const backScreen = route.params?.backScreen
  const contractAddress = route.params?.contractAddress || assets[0]

  const [chainId, setChainId] = useState<number>(31)
  // We assume only one bitcoinNetwork instance exists
  const { currentTransaction, executePayment, error } = usePaymentExecutor(
    assets.find(asset => 'bips' in asset),
  )

  useEffect(() => {
    wallet.getChainId().then(setChainId)
  }, [wallet])

  const onGoToHome = useCallback(
    () =>
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Main,
      }),
    [navigation],
  )

  const onExecuteTransfer = useCallback(
    (token: TokenBalanceObject, amount: number, to: string) => {
      Keyboard.dismiss()
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

  const onCancel = useCallback(() => {
    if (backScreen) {
      return navigation.navigate(backScreen)
    }

    return navigation.goBack()
  }, [backScreen, navigation])

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
        [{ onPress: navigation.goBack, text: t('ok') }],
      )
    }
  }, [loading, t, navigation])

  // Status to let the user know about his current process
  let status
  if (error) {
    status = error.toString()
  } else if (
    currentTransaction?.status &&
    currentTransaction.status === 'USER_CONFIRM'
  ) {
    status = 'Sending transaction...'
  }

  // When a transaction goes through, show congratulations component
  if (
    currentTransaction?.status === 'PENDING' &&
    currentTransaction.value &&
    currentTransaction.symbol
  ) {
    return (
      <CongratulationsComponent
        amount={currentTransaction.value}
        tokenSymbol={currentTransaction.symbol}
        onCloseTap={onGoToHome}
      />
    )
  }

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <TransactionForm
        onConfirm={onExecuteTransfer}
        onCancel={onCancel}
        tokenList={assets}
        totalUsdBalance={totalUsdBalance}
        tokenPrices={prices}
        chainId={chainId}
        isWalletDeployed={walletDeployed.isDeployed}
        initialValues={{
          recipient: route.params?.contact,
          asset: assets.find(
            asset => asset.contractAddress === contractAddress,
          ),
        }}
        status={status}
      />
    </KeyboardAvoidingView>
  )
}
