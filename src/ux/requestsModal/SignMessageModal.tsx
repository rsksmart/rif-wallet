import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { SignMessageRequest } from '@rsksmart/rif-wallet-core'

import { ScrollView } from 'react-native-gesture-handler'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { sharedStyles } from 'src/shared/styles'
import ReadOnlyField from './ReadOnlyField'

interface Interface {
  request: SignMessageRequest
  closeModal: () => void
}

const SignMessageModal: React.FC<Interface> = ({ request, closeModal }) => {
  const { t } = useTranslation()

  const reject = () => {
    request.reject()
    closeModal()
  }

  const signMessage = () => {
    request.confirm()
    closeModal()
  }

  return (
    <ScrollView>
      <View>
        <View testID="TX_VIEW" style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label={'Payload'}
            value={request.payload}
            testID="Text.Message"
          />
        </View>
      </View>

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SecondaryButton
            onPress={reject}
            title={t('reject')}
            testID="Button.Reject"
            accessibilityLabel="reject"
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
            onPress={signMessage}
            title={t('sign')}
            testID="Button.Confirm"
            accessibilityLabel="confirm"
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
})

export default SignMessageModal
