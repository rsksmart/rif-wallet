import { useFocusEffect, useIsFocused } from '@react-navigation/native'
import { ReactNode, useCallback, useEffect, useMemo } from 'react'
import { BackHandler } from 'react-native'
import { showMessage } from 'react-native-flash-message'
import { useTranslation } from 'react-i18next'

import { shortAddress } from 'lib/utils'

import { AppButtonProps } from 'components/button'
import { CurrencyValue } from 'components/token'
import { sharedHeaderLeftOptions } from 'navigation/index'
import { contactsStackRouteNames } from 'navigation/contactsNavigator'
import {
  RootTabsScreenProps,
  rootTabsRouteNames,
} from 'navigation/rootNavigator'
import { isMyAddress } from 'components/index'
import { TransactionSummaryComponent } from 'screens/transactionSummary/TransactionSummaryComponent'
import { setFullscreen } from 'store/slices/settingsSlice'
import { TokenFeeValueObject } from 'store/slices/transactionsSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { useWallet } from 'shared/wallet'
import { getPopupMessage } from 'shared/popupMessage'
import { ContactWithAddressRequired } from 'shared/types'
import { TransactionStatus } from 'store/shared/types'
import { getContactByAddress } from 'store/slices/contactsSlice'

export interface TransactionSummaryScreenProps {
  transaction: {
    to: string
    tokenValue: CurrencyValue
    usdValue: CurrencyValue
    fee: TokenFeeValueObject
    time: string
    totalToken: number
    totalUsd: number
    hashId?: string
    status?: TransactionStatus
    amIReceiver?: boolean
    from?: string
  }
  contact: ContactWithAddressRequired
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
  const { t } = useTranslation()
  const { transaction, backScreen } = route.params
  const { to, from } = transaction

  const { address } = useWallet()
  const dispatch = useAppDispatch()
  const isFocused = useIsFocused()
  const amIReceiver = transaction.amIReceiver ?? isMyAddress(address, to)
  const contactAddress = amIReceiver ? from || '' : to
  const contact = useAppSelector(
    getContactByAddress(contactAddress.toLowerCase()),
  )
  const contactToUse = contact || { address: contactAddress }

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

  const moveToCreateContact = useCallback(() => {
    navigation.navigate(rootTabsRouteNames.Contacts, {
      screen: contactsStackRouteNames.ContactForm,
      params: {
        initialValue: {
          address: contactAddress,
          name: '',
          displayAddress: '',
        },
        proposed: true,
      },
    })
  }, [navigation, contactAddress])

  useEffect(() => {
    if (!contact) {
      showMessage(
        getPopupMessage(
          `${t(
            'transaction_summary_add_non_existent_contact_title',
          )} ${shortAddress(contactAddress)} ${t(
            'transaction_summary_add_non_existent_contact_title_2',
          )}`,
          t('transaction_summary_add_non_existent_contact_action'),
          moveToCreateContact,
        ),
      )
    }
  }, [contact, contactAddress, moveToCreateContact, t])

  return (
    <TransactionSummaryComponent
      {...route.params}
      transaction={{ ...route.params.transaction, amIReceiver }}
      contact={contactToUse}
      goBack={goBack}
      address={address}
    />
  )
}
