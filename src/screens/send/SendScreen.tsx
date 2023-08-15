import { useCallback, useEffect } from 'react'
import { Alert, Keyboard, KeyboardAvoidingView, Platform } from 'react-native'
import { useTranslation } from 'react-i18next'
import { useIsFocused } from '@react-navigation/native'
import { convertSatoshiToBtcHuman } from '@rsksmart/rif-wallet-bitcoin'

import { sharedHeaderLeftOptions } from 'navigation/index'
import {
  homeStackRouteNames,
  HomeStackScreenProps,
} from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { settingsStackRouteNames } from 'navigation/settingsNavigator/types'
import { selectUsdPrices } from 'store/slices/usdPricesSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectWalletState, setFullscreen } from 'store/slices/settingsSlice'
import {
  selectBalances,
  selectTotalUsdValue,
} from 'store/slices/balancesSlice/selectors'
import { sharedColors, sharedStyles } from 'shared/constants'
import { TokenBalanceObject } from 'store/slices/balancesSlice/types'
import { selectChainId } from 'store/slices/settingsSlice'
import { FullScreenSpinner } from 'components/fullScreenSpinner'
import { SuccessIcon } from 'components/icons/SuccessIcon'
import { FeedbackModal } from 'components/feedbackModal'

import { TransactionForm } from './TransactionForm'
import { usePaymentExecutor } from './usePaymentExecutor'
import { TokenSymbol } from '../home/TokenImage'

export const SendScreen = ({
  route,
  navigation,
}: HomeStackScreenProps<homeStackRouteNames.Send>) => {
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const { t } = useTranslation()
  const { wallet, walletIsDeployed } = useAppSelector(selectWalletState)
  const { loading, isDeployed } = walletIsDeployed
  const assets = Object.values(useAppSelector(selectBalances))
  const chainId = useAppSelector(selectChainId)

  const totalUsdBalance = useAppSelector(selectTotalUsdValue)
  const prices = useAppSelector(selectUsdPrices)
  const { backScreen, contact } = route.params
  const contractAddress = route.params?.contractAddress || assets[0]

  // We assume only one bitcoinNetwork instance exists
  const { currentTransaction, executePayment, error } = usePaymentExecutor(
    assets.find(asset => 'bips' in asset),
  )

  const onGoToHome = useCallback(
    () =>
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Main,
      }),
    [navigation],
  )

  const onExecuteTransfer = (
    token: TokenBalanceObject,
    feeToken: TokenBalanceObject,
    amount: number,
    to: string,
  ) => {
    Keyboard.dismiss()
    executePayment({
      token,
      feeToken,
      amount,
      to,
      wallet,
      chainId,
    })
  }

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

  // Hide header when transaction is loading
  useEffect(() => {
    navigation.setOptions({
      headerShown: !(currentTransaction?.status === 'USER_CONFIRM'),
    })
  }, [currentTransaction?.status, navigation])

  // setFullscreen to avoid scanning error
  // when you try to scan code again from main bottom nav
  useEffect(() => {
    setTimeout(() => {
      dispatch(setFullscreen(isFocused))
    }, 100)
  }, [dispatch, isFocused])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => sharedHeaderLeftOptions(onCancel),
    })
  }, [navigation, onCancel])

  // Status to let the user know about his current process
  let status
  if (error) {
    status = error.toString()
  } else if (
    currentTransaction?.status &&
    currentTransaction.status === 'USER_CONFIRM'
  ) {
    status = t('send_screen_sending_transaction')
  }

  useEffect(() => {
    if (
      currentTransaction?.status === 'SUCCESS' ||
      currentTransaction?.status === 'FAILED'
    ) {
      navigation.navigate(rootTabsRouteNames.Home, {
        screen: homeStackRouteNames.Main,
      })
    }
  }, [navigation, currentTransaction])

  const value =
    currentTransaction && currentTransaction.value
      ? currentTransaction.symbol === TokenSymbol.BTC
        ? convertSatoshiToBtcHuman(currentTransaction.value)
        : currentTransaction.value
      : undefined

  return (
    <KeyboardAvoidingView
      style={sharedStyles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      {/* Render Feedback when transaction is PENDING */}
      <FeedbackModal
        visible={Boolean(value)}
        title={t('transaction_summary_congrats')}
        texts={[
          `${t('transaction_summary_you_sent')} ${value} ${
            currentTransaction?.symbol
          }.`,
          t('transaction_summary_your_transaction'),
          t('transaction_summary_check_status'),
        ]}
        FeedbackComponent={<SuccessIcon />}
        buttons={[
          {
            title: t('send_screen_return_to_home'),
            onPress: onGoToHome,
            color: sharedColors.white,
            textColor: sharedColors.black,
            accessibilityLabel: 'return',
          },
        ]}
      />
      <TransactionForm
        onConfirm={onExecuteTransfer}
        onCancel={onCancel}
        tokenList={assets}
        totalUsdBalance={totalUsdBalance}
        tokenPrices={prices}
        chainId={chainId}
        isWalletDeployed={walletIsDeployed.isDeployed}
        initialValues={{
          recipient: contact,
          asset: assets.find(
            asset => asset.contractAddress === contractAddress,
          ),
        }}
        status={status}
      />
      {currentTransaction?.status === 'USER_CONFIRM' && (
        <FullScreenSpinner message={{ text: status }} />
      )}
    </KeyboardAvoidingView>
  )
}
