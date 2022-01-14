import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SignMessageRequest } from '../../lib/core/RIFWallet'
import { useTranslation, Trans } from 'react-i18next'

import { ModalHeader, ParagraphSoft } from '../../components'
import { sharedStyles } from './sharedStyles'
import { SquareButton } from '../../components/button/SquareButton'
import { SignIcon } from '../../components/icons/SignIcon'
import { CancelIcon } from '../../components/icons/CancelIcon'
import { ScrollView } from 'react-native-gesture-handler'

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
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>sign message</ModalHeader>

        <ParagraphSoft>
          <Trans>Do you want to sign this message?</Trans>
        </ParagraphSoft>

        <Text style={styles.message} testID="Text.Message">
          {request.payload}
        </Text>
      </View>
      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SquareButton
            onPress={reject}
            title={t('reject')}
            testID="Button.Reject"
            icon={<CancelIcon color={'#ffb4b4'} />}
            shadowColor="#313c3c"
            backgroundColor={'#313c3c'}
          />
        </View>
        <View style={sharedStyles.column}>
          <SquareButton
            onPress={signMessage}
            title={t('sign')}
            testID="Button.Confirm"
            icon={<SignIcon color={'#91ffd9'} />}
            shadowColor="#313c3c"
            backgroundColor={'#313c3c'}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  message: {
    padding: 20,
    marginTop: 10,
    marginBottom: 10,

    borderRadius: 14,
    backgroundColor: 'rgba(49, 60, 60, 0.1)',
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
  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
})

export default SignMessageModal
