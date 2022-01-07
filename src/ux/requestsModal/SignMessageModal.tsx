import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SignMessageRequest } from '../../lib/core/RIFWallet'
import { useTranslation, Trans } from 'react-i18next'

import { Button, Header2, Paragraph } from '../../components'
import { sharedStyles } from './sharedStyles'
import { setOpacity } from '../../screens/home/tokenColor'

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
    <>
      <View
        style={{
          ...sharedStyles.modalView,
          padding: 35,
          margin: 0,
          backgroundColor: '#fff',
        }}>
        <Header2>Sign Message</Header2>

        <Paragraph>
          <Trans>Do you want to sign this message?</Trans>
        </Paragraph>

        <Text style={styles.message} testID="Text.Message">
          {request.payload}
        </Text>
      </View>
      <View style={{ ...sharedStyles.row, padding: 35 }}>
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
    </>
  )
}

const styles = StyleSheet.create({
  message: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,

    borderRadius: 14,
    backgroundColor: setOpacity('#313c3c', 0.1),
    shadowColor: 'rgba(0, 0, 0, 0)',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 6,
    shadowOpacity: 1,

    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'normal',
    letterSpacing: 0.24,
    color: '#373f48',
  },
})

export default SignMessageModal
