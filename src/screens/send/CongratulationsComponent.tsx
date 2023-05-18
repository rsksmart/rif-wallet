import { t } from 'i18next'

import { FeedbackModal } from 'components/feedbackModal'
import { AppSpinner } from 'src/components'
import { sharedColors } from 'shared/constants'

interface CongratulationsComponentProps {
  amount: string
  tokenSymbol: string
  onCloseTap: () => void
}

export const CongratulationsComponent = ({
  amount,
  tokenSymbol,
  onCloseTap,
}: CongratulationsComponentProps) => (
  <FeedbackModal
    visible={true}
    title={t('transaction_summary_congrats')}
    subtitle={`${t('transaction_summary_you_sent')} ${amount} ${tokenSymbol}`}
    footerText={t('transaction_pending')}
    feedbackComponent={<AppSpinner size={174} />}
    buttons={[
      {
        title: t('close'),
        onPress: onCloseTap,
        color: sharedColors.white,
        textColor: sharedColors.black,
      },
    ]}
  />
)
