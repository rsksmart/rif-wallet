import { useCallback, useState } from 'react'
// import { SendBitcoinRequest } from '@rsksmart/rif-wallet-bitcoin'
// import {
//   SignMessageRequest,
//   SignTypedDataRequest,
// } from '@rsksmart/rif-wallet-core'
import { useTranslation } from 'react-i18next'
import { BigNumberish } from 'ethers'

import { convertTokenToUSD } from 'lib/utils'

import { RequestWithBitcoin } from 'shared/types'
import { navigationContainerRef } from 'core/Core'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
// import { useFetchBitcoinNetworksAndTokens } from 'screens/send/useFetchBitcoinNetworksAndTokens'
import { TokenSymbol } from 'src/screens/home/TokenImage'
import { sharedColors } from 'src/shared/constants'
import { AppButtonBackgroundVarietyEnum } from 'src/components'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectUsdPrices } from 'src/redux/slices/usdPricesSlice'
import { FeedbackModal } from 'src/components/feedbackModal'
import { AppSpinner } from 'src/screens/spinner'

import { ReviewTransactionContainer } from './ReviewRelayTransaction/ReviewTransactionContainer'
// import SignMessageModal from './SignMessageModal'
// import SignTypedDataModal from './SignTypedDataModal'
// import ConfirmBitcoinTransactionModal from './ConfirmBitcoinTransactionModal'

interface Props {
  request: RequestWithBitcoin
  closeRequest: () => void
}

export interface RequestTypeSwitchProps {
  request: RequestWithBitcoin
  onCancel: () => void
  onConfirm: (amount: BigNumberish, tokenSymbol: string) => void
}

const RequestTypeSwitch = ({
  request,
  onCancel,
  onConfirm,
}: RequestTypeSwitchProps) => {
  const { t } = useTranslation()
  const tokenPrices = useAppSelector(selectUsdPrices)

  switch (request.type) {
    // case 'signMessage':
    //   return <SignMessageModal request={request} />
    // case 'signTypedData':
    //   return <SignTypedDataModal request={request} />
    case 'sendTransaction':
      return (
        <ReviewTransactionContainer
          request={request}
          onCancel={onCancel}
          onConfirm={onConfirm}
        />
      )
    case 'SEND_BITCOIN':
      const {
        payload: { amountToPay, addressToPay, miningFee },
      } = request
      navigationContainerRef.navigate(rootTabsRouteNames.TransactionSummary, {
        transaction: {
          tokenValue: {
            balance: amountToPay.toString(),
            symbolType: 'icon',
            symbol: TokenSymbol.BTC,
          },
          usdValue: {
            balance: convertTokenToUSD(
              amountToPay,
              tokenPrices.BTC.price,
              true,
            ).toString(),
            symbolType: 'text',
            symbol: '$',
          },
          feeValue: miningFee.toString(),
          time: 'approx 1 min',
          total: amountToPay.toString(),
        },
        contact: {
          address: addressToPay,
        },
        buttons: [
          {
            title: t('transaction_summary_title_confirm_button_title'),
            onPress: request.confirm,
            color: sharedColors.white,
            textColor: sharedColors.black,
          },
          {
            title: t('transaction_summary_title_cancel_button_title'),
            onPress: request.reject,
            backgroundVariety: AppButtonBackgroundVarietyEnum.OUTLINED,
          },
        ],
      })
      return null
    default:
      return null
  }
}

export const RequestHandler = ({ request, closeRequest }: Props) => {
  const { t } = useTranslation()
  const [requestSuccess, setRequestSuccess] = useState(false)
  const [amount, setAmount] = useState<BigNumberish>('')
  const [tokenSymbol, setTokenSymbol] = useState<string>('')

  const onConfirm = useCallback(
    (amountSent: BigNumberish, token: string) => {
      closeRequest()
      setTokenSymbol(token)
      setAmount(amountSent)
      setRequestSuccess(true)
    },
    [closeRequest],
  )

  const onCancel = useCallback(() => {
    navigationContainerRef.goBack()
    closeRequest()
  }, [closeRequest])

  if (requestSuccess) {
    return (
      <FeedbackModal
        title={t('transaction_summary_congrats')}
        subtitle={`${t(
          'transaction_summary_you_sent',
        )} ${amount} ${tokenSymbol}`}
        feedbackComponent={<AppSpinner size={174} />}
      />
    )
  }

  return RequestTypeSwitch({ request, onCancel, onConfirm })
}
