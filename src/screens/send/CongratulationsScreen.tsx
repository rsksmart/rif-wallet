import { t } from 'i18next'
import { StyleSheet, View } from 'react-native'

import { FeedbackModal } from 'components/feedbackModal'
import { AppSpinner } from 'src/components'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

interface CongratulationsScreenProps {
  amount: string
  tokenSymbol: string
  onClose: () => void
}

export const CongratulationsScreen = ({
  amount,
  tokenSymbol,
  onClose,
}: CongratulationsScreenProps) => (
  <FeedbackModal
    visible={true}
    title={t('transaction_summary_congrats')}
    content={[
      `${t('transaction_summary_you_sent')} ${amount} ${tokenSymbol}.`,
      t('transaction_summary_your_transaction'),
      t('transaction_summary_check_status'),
    ]}
    backgroundColor={sharedColors.black}
    FeedbackComponent={
      <View style={styles.viewSpinner}>
        <AppSpinner size={174} />
      </View>
    }
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

const styles = StyleSheet.create({
  viewSpinner: castStyle.view({ flexBasis: '50%', justifyContent: 'flex-end' }),
})
