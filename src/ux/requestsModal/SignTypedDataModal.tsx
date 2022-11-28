import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'

import { SignTypedDataRequest } from 'src/lib/core'

import { useTranslation } from 'react-i18next'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { SecondaryButton } from 'src/components/button/SecondaryButton'
import { RegularText } from 'src/components'
import { sharedStyles } from 'src/shared/styles'
import { colors } from 'src/styles'
import ReadOnlyField from './ReadOnlyField'

interface Interface {
  request: SignTypedDataRequest
  closeModal: () => void
}

const formatter = (data: any) =>
  Object.keys(data).map((key: string) => (
    <View key={key} style={styles.nested} testID="Formatter.Row">
      <Text style={styles.heading} testID="Text.Heading">
        {key}
      </Text>
      {typeof data[key] !== 'object' ? (
        <Text style={styles.value} testID="Text.Value">
          {data[key].toString()}
        </Text>
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
          <View>
            <RegularText style={styles.label}>message</RegularText>
          </View>
          <View style={styles.message}>{formatter(request.payload[2])}</View>
        </View>
      </View>

      <View style={styles.buttonsSection}>
        <View style={sharedStyles.column}>
          <SecondaryButton
            style={{ button: { borderColor: colors.black } }}
            onPress={reject}
            title={t('reject')}
            testID="Button.Reject"
          />
        </View>
        <View style={sharedStyles.column}>
          <PrimaryButton
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
    fontWeight: 'bold',
    width: '100%',
  },
  value: {
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
})

export default SignTypedDataModal
