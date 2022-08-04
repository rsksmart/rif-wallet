import React from 'react'
import { View, StyleSheet } from 'react-native'
import { SignMessageRequest } from '../../lib/core/RIFWallet'
import { useTranslation } from 'react-i18next'

import { sharedStyles } from './sharedStyles'
import { ScrollView } from 'react-native-gesture-handler'
import ReadOnlyField from './ReadOnlyField'
import {
  DarkBlueButton,
  OutlineBorderedButton,
} from '../../components/button/ButtonVariations'
import { colors } from '../../styles'

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
            testID={'Data.View'}
          />
        </View>
      </View>

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <OutlineBorderedButton
            style={{ button: { borderColor: colors.black } }}
            onPress={reject}
            title={t('reject')}
            testID="Cancel.Button"
          />
        </View>
        <View style={sharedStyles.column}>
          <DarkBlueButton
            onPress={signMessage}
            title={t('sign')}
            testID="Confirm.Button"
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
