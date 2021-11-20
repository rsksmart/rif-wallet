import React, { useState } from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'
import {
  validateAddress,
  AddressValidationMessage,
  toChecksumAddress,
} from './lib'

type AddressInputProps = {
  placeholder: string
  value: string
  onChangeText: (isValid: boolean, address: string) => void
  testID: string
}

export const AddressInput: React.FC<AddressInputProps> = ({
  placeholder,
  value,
  onChangeText,
  testID,
}) => {
  const [validationMessage, setValidationMessage] = useState(
    validateAddress(value),
  )

  const handleChangeText = (text: string) => {
    const newValidationMessage = validateAddress(text)
    setValidationMessage(newValidationMessage)
    onChangeText(!!text && !newValidationMessage, text)
  }

  return (
    <>
      <TextInput
        onChangeText={handleChangeText}
        value={value}
        placeholder={placeholder}
        testID={testID}
      />
      <Text style={styles.error} testID={testID + '.ValidationMessage'}>
        {validationMessage}
      </Text>
      {validationMessage === AddressValidationMessage.INVALID_CHECKSUM && (
        <Text
          testID={testID + '.ToChecksumHandle'}
          style={styles.link}
          onPress={() => handleChangeText(toChecksumAddress(value, 31))}>
          {' '}
          [To Checksum]
        </Text>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  error: {
    color: 'red',
  },
  link: {
    color: 'blue',
  },
})
