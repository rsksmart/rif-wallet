import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { ZERO_ADDRESS } from '@rsksmart/rif-relay-light-sdk'

import { shortAddress } from 'lib/utils'

import { isMyAddress } from 'components/address/lib'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/appTouchable'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { TransactionSummaryScreenProps } from 'screens/transactionSummary'
import { ActivityMainScreenProps } from 'shared/types'
import { useAppSelector } from 'store/storeUtils'
import { getContactByAddress } from 'store/slices/contactsSlice'
import { ActivityRowPresentationObject } from 'store/slices/transactionsSlice'
import { formatTokenValue, formatFiatValue } from 'shared/utils'
import { Wallet, useWallet } from 'shared/wallet'
import { TransactionStatus } from 'store/shared/types'

const getStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return StatusEnum.PENDING
    case 'failed':
      return StatusEnum.FAILED
    default:
      return undefined
  }
}

interface Props {
  index?: number
  wallet: Wallet
  activityDetails: ActivityRowPresentationObject
  navigation: ActivityMainScreenProps['navigation']
  backScreen?: rootTabsRouteNames
  style?: StyleProp<ViewStyle>
}

export const ActivityBasicRow = ({
  index,
  wallet,
  navigation,
  activityDetails,
  backScreen,
  style,
}: Props) => {
  const {
    symbol,
    value,
    status,
    fee,
    timeHumanFormatted,
    from = '',
    to = '',
    price: usdValue,
    id,
  } = activityDetails
  const { address: walletAddress } = useWallet()
  const { t } = useTranslation()

  // Contact
  const amIReceiver =
    activityDetails.amIReceiver ?? isMyAddress(walletAddress, to)
  const address = amIReceiver ? from : to
  const contact = useAppSelector(getContactByAddress(address.toLowerCase()))

  // Label
  const firstLabel = amIReceiver ? t('received_from') : t('sent_to')
  const secondLabel = contact?.name || shortAddress(address)
  let label = `${firstLabel} ${secondLabel}`
  if (
    to === ZERO_ADDRESS &&
    from.toLowerCase() === wallet?.smartWalletFactory?.address.toLowerCase()
  ) {
    label = t('wallet_deployment_label')
  }

  const txSummary: TransactionSummaryScreenProps = useMemo(() => {
    const totalUsd = isNaN(usdValue) ? '' : usdValue + Number(fee.usdValue)
    const feeUsd = isNaN(+fee.usdValue) ? '' : fee.usdValue
    const usdAmount = isNaN(usdValue) ? '' : usdValue

    const totalToken =
      symbol === fee.symbol
        ? Number(value) + Number(fee.tokenValue)
        : Number(value)

    return {
      transaction: {
        tokenValue: {
          symbol,
          symbolType: 'icon',
          balance: value,
        },
        usdValue: {
          symbol: '$',
          symbolType: 'usd',
          balance: usdAmount,
        },
        fee: {
          symbol: fee.symbol || symbol,
          tokenValue: fee.tokenValue,
          usdValue: feeUsd,
        },
        totalToken,
        totalUsd,
        status: status.toUpperCase() as TransactionStatus,
        amIReceiver,
        from,
        to,
        time: timeHumanFormatted,
        hashId: id,
      },
      contact: contact || { address },
    }
  }, [
    fee,
    symbol,
    value,
    usdValue,
    status,
    amIReceiver,
    from,
    to,
    timeHumanFormatted,
    id,
    contact,
    address,
  ])

  const amount = symbol.startsWith('BTC') ? value : formatTokenValue(value)
  const isUnknownToken = !usdValue && Number(value) > 0
  const usdAmount = isUnknownToken ? '' : formatFiatValue(usdValue)

  const handlePress = useCallback(() => {
    if (txSummary) {
      navigation.navigate(rootTabsRouteNames.TransactionSummary, {
        ...txSummary,
        backScreen,
      })
    }
  }, [navigation, txSummary, backScreen])

  return (
    <AppTouchable width={'100%'} onPress={handlePress} style={style}>
      <BasicRowWithContact
        index={index}
        label={label}
        amount={amount}
        symbol={symbol}
        status={getStatus(status)}
        avatar={{ name: 'A' }}
        secondaryLabel={timeHumanFormatted}
        usdAmount={usdAmount}
        contact={contact}
      />
    </AppTouchable>
  )
}
