import { t } from 'i18next'
import { StyleSheet, View } from 'react-native'

import { FeedbackModal } from 'components/feedbackModal'
import { AppSpinner } from 'src/components'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

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
    feedbackComponent={
      <View style={styles.viewSpinner}>
        <AppSpinner size={174} />
      </View>
    }
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

const styles = StyleSheet.create({
  viewSpinner: castStyle.view({ flexBasis: '50%', justifyContent: 'flex-end' }),
})
