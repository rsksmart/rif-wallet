import React, { useState } from 'react'
import { Text, TextInput, StyleSheet } from 'react-native'
import Resolver from '@rsksmart/rns-resolver.js'

import {
  validateAddress,
  AddressValidationMessage,
  toChecksumAddress,
} from './lib'

type AddressInputProps = {
  placeholder: string
  value: string
  onChangeText: (
    isValid: boolean,
    address: string,
    displayAddress: string,
  ) => void
  testID: string
  rnsResolver: Resolver
}

export const AddressInput: React.FC<AddressInputProps> = ({
  placeholder,
  value,
  onChangeText,
  testID,
  rnsResolver,
}) => {
  const [validationMessage, setValidationMessage] = useState(
    validateAddress(value),
  )

  const [inputInfo, setInputInfo] = useState('')

  const handleChangeText = (inputText: string) => {
    setInputInfo('')
    const newValidationMessage = validateAddress(inputText)

    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      setInputInfo('Loading...')
      setValidationMessage(AddressValidationMessage.VALID)
      rnsResolver
        .addr(inputText)
        .then((address: string) => {
          setValidationMessage(AddressValidationMessage.VALID)
          setInputInfo(address)
          onChangeText(true, address, inputText)
        })
        .catch((e: any) => {
          setValidationMessage(AddressValidationMessage.NO_ADDRESS_DOMAIN)
          onChangeText(false, inputText, inputText)
          console.log(e.message)
          setInputInfo('')
        }) // gets rs
    } else {
      setValidationMessage(newValidationMessage)
      onChangeText(!!inputText && !newValidationMessage, inputText, inputText)
    }
  }

  return (
    <>
      <TextInput
        onChangeText={handleChangeText}
        value={value}
        placeholder={placeholder}
        testID={testID}
        editable={inputInfo !== 'Loading...'}
      />

      {inputInfo !== '' && (
        <Text style={styles.info} testID={testID + '.InputInfo'}>
          {inputInfo}
        </Text>
      )}
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
  info: {
    color: 'blue',
  },
  link: {
    color: 'blue',
  },
})
