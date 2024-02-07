import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, ViewStyle } from 'react-native'
import { ZERO_ADDRESS } from '@rsksmart/rif-relay-light-sdk'

import { roundBalance, shortAddress } from 'lib/utils'

import { isMyAddress } from 'components/address/lib'
import { StatusEnum } from 'components/BasicRow'
import { BasicRowWithContact } from 'components/BasicRow/BasicRowWithContact'
import { AppTouchable } from 'components/appTouchable'
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
  wallet: Wallet
  activityDetails: ActivityRowPresentationObject
  moveToSummary: (activityTx: ActivityRowPresentationObject) => void
  index?: number
  style?: StyleProp<ViewStyle>
}

export const ActivityBasicRow = ({
  index,
  wallet,
  moveToSummary,
  activityDetails,
  style,
}: Props) => {
  const {
    symbol,
    value,
    status,
    timeHumanFormatted,
    from = '',
    to = '',
    price,
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

  return (
    <AppTouchable
      width={'100%'}
      onPress={() => moveToSummary(activityDetails)}
      style={style}>
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
