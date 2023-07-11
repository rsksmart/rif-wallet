import { t } from 'i18next'
import { useEffect, useState } from 'react'

import { FeedbackModal } from 'components/feedbackModal'
import { sharedColors } from 'shared/constants'
import { AppSpinner } from 'src/components'
import { SuccessIcon } from 'src/components/icons/SuccessIcon'

interface Props {
  amount: string
  tokenSymbol: string
  onClose: () => void
}

export const CongratulationsScreen = ({
  amount,
  tokenSymbol,
  onClose,
}: Props) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => setLoading(false), 500)
  }, [])

  return (
    <FeedbackModal
      visible={true}
      title={t('transaction_summary_congrats')}
      texts={[
        `${t('transaction_summary_you_sent')} ${amount} ${tokenSymbol}.`,
        t('transaction_summary_your_transaction'),
        t('transaction_summary_check_status'),
      ]}
      backgroundColor={sharedColors.black}
      FeedbackComponent={loading ? <AppSpinner size={174} /> : <SuccessIcon />}
      loading={loading}
      buttons={[
        {
          title: t('close'),
          onPress: onClose,
          color: sharedColors.white,
          textColor: sharedColors.black,
        },
      ]}
    />
  )
}
