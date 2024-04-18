import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { BackHandler } from 'react-native'

import { AppButtonProps } from 'components/button'
import { CurrencyValue } from 'components/token'
import { sharedHeaderLeftOptions } from 'navigation/index'
import {
  RootTabsScreenProps,
  rootTabsRouteNames,
} from 'navigation/rootNavigator'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { setFullscreen } from 'store/slices/settingsSlice'
import { TokenFeeValueObject } from 'store/slices/transactionsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { useWallet } from 'shared/wallet'
import { TransactionStatus } from 'store/shared/types'

export interface TransactionSummaryScreenProps {
  transaction: {
    to: string
    tokenValue: CurrencyValue
    usdValue: CurrencyValue
    fee: TokenFeeValueObject
    time: string
    totalToken: number
    totalUsd: number | string
    hashId?: string
    status?: TransactionStatus
    amIReceiver?: boolean
    from?: string
  }
  buttons?: [AppButtonProps, AppButtonProps]
  functionName?: string
  backScreen?: rootTabsRouteNames
  isLoaded?: boolean
  FeeComponent?: ReactNode
}

export const TransactionSummaryScreen = ({
  route,
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.TransactionSummary>) => {
  const { address } = useWallet()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const { backScreen } = route.params

  const goBack = useMemo(() => {
    if (backScreen) {
      return () => navigation.navigate(backScreen)
    }
    return navigation.goBack
  }, [backScreen, navigation])

  useEffect(() => {
    dispatch(setFullscreen(isFocused))
  }, [dispatch, isFocused])

  /* override hard back button */
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        goBack()
        return true
      }

      BackHandler.addEventListener('hardwareBackPress', onBackPress)
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress)
    }, [goBack]),
  )

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => sharedHeaderLeftOptions(goBack),
    })
  }, [goBack, navigation])

  return (
    <TransactionSummaryComponent
      {...route.params}
      goBack={goBack}
      address={address}
    />
  )
}
