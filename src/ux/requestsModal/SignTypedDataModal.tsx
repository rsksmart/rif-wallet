import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { SignTypedDataRequest } from 'src/lib/core'

import { AnyObject } from 'immer/dist/internal'
import { useTranslation } from 'react-i18next'
import { RegularText, SemiBoldText } from 'src/components'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { sharedStyles } from 'src/shared/styles'
import { colors } from 'src/styles'
import ReadOnlyField from './ReadOnlyField'

interface Interface {
  request: SignTypedDataRequest
  closeModal: () => void
}

const formatter = (data: AnyObject) =>
  Object.keys(data).map((key: string) => (
    <View key={key} style={styles.nested} testID="Formatter.Row">
      <SemiBoldText style={styles.heading} testID="Text.Heading">
        {key}
      </SemiBoldText>
      {typeof data[key] !== 'object' ? (
        <RegularText style={styles.value} testID="Text.Value">
          {data[key].toString()}
        </RegularText>
      ) : (
        formatter(data[key])
      )}
    </View>
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
            label={'tx type'}
            value={request.type}
            testID="tx.type"
          />

          <ReadOnlyField
            label={'name'}
            value={request.payload[0].name || ''}
            testID="Domain.Name"
          />

          <ReadOnlyField
            label={'version'}
            value={request.payload[0].version || ''}
            testID="Domain.Version"
          />

          <ReadOnlyField
            label={'chain id'}
            value={request.payload[0].chainId?.toString() || ''}
            testID="Domain.ChainId"
          />

          <ReadOnlyField
            label={'verifying Contract'}
            value={request.payload[0].verifyingContract || ''}
            testID="Domain.VerifyingContract"
          />
          <View>
            <RegularText style={styles.label}>message</RegularText>
          </View>
          <View style={styles.message}>{formatter(request.payload[2])}</View>
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
            onPress={approve}
            title={t('sign')}
            testID="Button.Confirm"
            accessibilityLabel="confirm"
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
  label: {
    margin: 5,
  },
  message: {
    borderColor: colors.darkGray,
    borderWidth: 1,
    borderRadius: 15,
  },
  nested: {
    marginLeft: 20,
    marginTop: 5,
  },
  heading: {
    width: '100%',
  },
  value: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
})

export default SignTypedDataModal
