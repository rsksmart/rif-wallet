import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'

import { SignTypedDataRequest } from '../../lib/core'

import { Button, CompactParagraph, Header2 } from '../../components'
import { sharedStyles } from './sharedStyles'

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
  const approve = () => {
    request.confirm()
    closeModal()
  }

  const reject = () => {
    request.reject('User rejected.')
    closeModal()
  }

  return (
    <View>
      <Header2>Sign Typed Data</Header2>

      <View style={sharedStyles.rowInColumn}>
        <CompactParagraph testID="Domain.Name">
          Name: {request.payload[0].name}
        </CompactParagraph>
        <CompactParagraph testID="Domain.Version">
          Version: {request.payload[0].version}
        </CompactParagraph>
        <CompactParagraph testID="Domain.ChainId">
          Chain Id: {request.payload[0].chainId}
        </CompactParagraph>
        <CompactParagraph testID="Domain.VerifyingContract">
          Verifying Contract: {request.payload[0].verifyingContract}
        </CompactParagraph>
        <CompactParagraph testID="Domain.Salt">
          Salt: {request.payload[0].salt}
        </CompactParagraph>
      </View>

      <ScrollView style={styles.message} testID="Data.View">
        {formatter(request.payload[2])}
      </ScrollView>

      <View style={sharedStyles.row}>
        <View style={sharedStyles.column}>
          <Button
            onPress={approve}
            title="Sign Message"
            testID="Button.Confirm"
          />
        </View>
        <View style={sharedStyles.column}>
          <Button onPress={reject} title="Reject" testID="Button.Reject" />
        </View>
      </View>
    </View>
  )
}

export const styles = StyleSheet.create({
  message: {
    backgroundColor: '#f1f1f1',
    borderWidth: 1,
    borderColor: '#d1d1d1',
    paddingTop: 20,
    paddingBottom: 20,
    marginTop: 10,
    marginBottom: 20,
    maxHeight: '75%',
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
