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
import { selectWallet, setFullscreen } from 'store/slices/settingsSlice'
import { TokenFeeValueObject } from 'store/slices/transactionsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'

import { TransactionStatus } from './transactionSummaryUtils'

export interface TransactionSummaryScreenProps {
  transaction: {
    tokenValue: CurrencyValue
    usdValue: CurrencyValue
    fee: TokenFeeValueObject
    time: string
    status?: TransactionStatus
    amIReceiver?: boolean
    from?: string
    to: string
  }
  buttons?: AppButtonProps[]
  functionName?: string
  backScreen?: rootTabsRouteNames
  isLoaded?: boolean
  FeeComponent?: ReactNode
}

export const TransactionSummaryScreen = ({
  route,
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.TransactionSummary>) => {
  const wallet = useAppSelector(selectWallet)
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
      wallet={wallet}
    />
  )
}
