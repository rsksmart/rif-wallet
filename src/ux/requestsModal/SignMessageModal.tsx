import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SignMessageRequest } from '../../lib/core/RIFWallet'
import { useTranslation, Trans } from 'react-i18next'

import { Button, Header2, Paragraph } from '../../components'
import { sharedStyles } from './sharedStyles'

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
    <View>
      <Header2>Sign Message</Header2>

      <Paragraph>
        <Trans>Do you want to sign this message?</Trans>
      </Paragraph>

      <Text style={styles.message} testID="Text.Message">
        {request.payload}
      </Text>

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Button
            onPress={signMessage}
            title={t('Sign Message')}
            testID="Button.Confirm"
          />
        </View>
        <View style={sharedStyles.column}>
          <Button onPress={reject} title={t('Reject')} testID="Button.Reject" />
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  message: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    padding: 20,
    marginTop: 10,
    marginBottom: 20,
  },
})

export default SignMessageModal
