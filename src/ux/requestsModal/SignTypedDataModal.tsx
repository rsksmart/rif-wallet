import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import { SignTypedDataRequest } from '../../lib/core'

import { sharedStyles } from './sharedStyles'
import { useTranslation } from 'react-i18next'
import ReadOnlyField from './ReadOnlyField'
import {
  DarkBlueButton,
  OutlineBorderedButton,
} from '../../components/button/ButtonVariations'
import { colors } from '../../styles'

interface Interface {
  request: SignTypedDataRequest
  closeModal: () => void
}

const formatter = (data: any) =>
  Object.keys(data).map((key: string) => (
    <ReadOnlyField
      label={key}
      value={data[key].toString()}
      testID="Text.Message"
    />
  ))

const SignTypedDataModal: React.FC<Interface> = ({ request, closeModal }) => {
  const { t } = useTranslation()

  const approve = () => {
    request.confirm()
    closeModal()
  }

  const reject = () => {
    request.reject('User rejected.')
    closeModal()
  }

  return (
    <ScrollView>
      <View>
        <View testID="TX_VIEW" style={[sharedStyles.rowInColumn]}>
          <ReadOnlyField
            label={'name'}
            value={request.payload[0].name}
            testID="Domain.Name"
          />

          <ReadOnlyField
            label={'version'}
            value={request.payload[0].version}
            testID="Domain.Version"
          />

          <ReadOnlyField
            label={'chain id'}
            value={request.payload[0].chainId}
            testID="Domain.ChainId"
          />

          <ReadOnlyField
            label={'verifying Contract'}
            value={request.payload[0].verifyingContract}
            testID="Domain.VerifyingContract"
          />

          <ReadOnlyField
            label={'salt'}
            value={request.payload[0].salt}
            testID="Domain.Salt"
          />

          <ReadOnlyField
            label={'mail'}
            value={request.payload[1].mail}
            testID="Text.Message"
          />

          {formatter(request.payload[2])}
        </View>
      </View>

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <OutlineBorderedButton
            style={{ button: { borderColor: colors.black } }}
            onPress={reject}
            title={t('reject')}
            testID="Button.Reject"
          />
        </View>
        <View style={sharedStyles.column}>
          <DarkBlueButton
            onPress={approve}
            title={t('sign')}
            testID="Button.Confirm"
          />
        </View>
      </View>
    </ScrollView>
  )
}

export const styles = StyleSheet.create({
  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
})

export default SignTypedDataModal
