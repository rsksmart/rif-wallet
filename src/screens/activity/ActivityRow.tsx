import { useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { ZERO_ADDRESS } from '@rsksmart/rif-relay-light-sdk'

import { roundBalance, shortAddress } from 'lib/utils'

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
import { Wallet } from 'shared/wallet'
import { useAddress } from 'shared/hooks'

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
    price,
    id,
  } = activityDetails
  const walletAddress = useAddress(wallet)
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

  // USD Balance
  const usdBalance = roundBalance(price, 2)

  const txSummary: TransactionSummaryScreenProps = useMemo(() => {
    const tokenUsd = usdBalance.toFixed(2)
    const feeUsd = Number(fee.usdValue).toFixed(2)
    const totalUsd = (Number(tokenUsd) + Number(feeUsd)).toFixed(2)
    const isAmountSmall = !usdBalance && !!price

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
          symbol: isAmountSmall ? '<' : '$',
          symbolType: 'usd',
          balance: isAmountSmall ? '0.01' : tokenUsd,
        },
        fee: {
          symbol: fee.symbol || symbol,
          tokenValue: fee.tokenValue,
          usdValue: feeUsd,
        },
        totalToken,
        totalUsd: totalUsd,
        status,
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
    usdBalance,
    price,
    status,
    amIReceiver,
    from,
    to,
    timeHumanFormatted,
    id,
    contact,
    address,
  ])

  const amount = useMemo(() => {
    if (symbol.startsWith('BTC')) {
      return value
    }
    const num = Number(value)
    let rounded = roundBalance(num, 4)
    if (!rounded) {
      rounded = roundBalance(num, 8)
    }
    return rounded.toString()
  }, [value, symbol])

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
        usdAmount={price === 0 ? undefined : usdBalance}
        contact={contact}
      />
    </AppTouchable>
  )
}
