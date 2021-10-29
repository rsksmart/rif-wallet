import React from 'react'
import { StyleSheet, Text, View, ScrollView } from 'react-native'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { Request } from '../lib/core'
import { styles as sharedStyles } from './ModalComponent'

// Temp: type to be refactored with the changes in the core
export interface SignTypedDataRequest extends Request {
  type: 'signTypedData'
  payload: any
}

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
    request.confirm()
    closeModal()
  }

  return (
    <View>
      <Header2>Sign Typed Data</Header2>

      <View style={sharedStyles.row}>
        <Paragraph>Name: {request.payload.domain.name}</Paragraph>
      </View>

      <ScrollView style={styles.message} testID="Data.View">
        {formatter(request.payload.message)}
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
