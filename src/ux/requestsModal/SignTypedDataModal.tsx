import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { SignTypedDataRequest } from '../../lib/core'

import { ModalHeader } from '../../components'
import { sharedStyles } from './sharedStyles'
import { useTranslation } from 'react-i18next'
import { SquareButton } from '../../components/button/SquareButton'
import { CancelIcon } from '../../components/icons/CancelIcon'
import { SignIcon } from '../../components/icons/SignIcon'
import { shortAddress } from '../../lib/utils'

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
      <View style={[sharedStyles.modalView, sharedStyles.modalViewMainSection]}>
        <ModalHeader>sign typed data</ModalHeader>

        <View style={[sharedStyles.rowInColumn, styles.topBox]}>
          <View style={styles.dataRow}>
            <Text style={styles.paragraphLabel}>name:</Text>
            <Text style={styles.paragraphValue} testID="Domain.Name">
              {request.payload[0].name}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.paragraphLabel}>version:</Text>
            <Text style={styles.paragraphValue} testID="Domain.Version">
              {request.payload[0].version}
            </Text>
          </View>
          <View style={styles.dataRow}>
            <Text style={styles.paragraphLabel}>chain id:</Text>
            <Text style={styles.paragraphValue} testID="Domain.ChainId">
              {request.payload[0].chainId}
            </Text>
          </View>
          {request.payload[0].verifyingContract && (
            <View style={styles.dataRow}>
              <Text style={styles.paragraphLabel}>verifying contract:</Text>
              <Text
                style={styles.paragraphValue}
                testID="Domain.VerifyingContract">
                {shortAddress(request.payload[0].verifyingContract)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.dataRow}>
          <Text style={styles.paragraphLabel}>salt:</Text>
          <Text style={styles.paragraphValue} testID="Domain.Salt">
            {request.payload[0].salt}
          </Text>
        </View>

        <ScrollView style={styles.message} testID="Data.View">
          {formatter(request.payload[2])}
        </ScrollView>
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
            onPress={approve}
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

export const styles = StyleSheet.create({
  message: {
    padding: 10,
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
  buttonsSection: {
    ...sharedStyles.row,
    padding: 20,
  },
  paragraphLabel: {
    fontSize: 14,
    color: 'rgba(55, 63, 72, 0.6)',
    fontWeight: 'bold',
    marginRight: 5,
  },
  paragraphValue: {
    fontSize: 14,
    color: 'rgba(55, 63, 72, 0.6)',
  },
  topBox: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  dataRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
})

export default SignTypedDataModal
