import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import Resolver from '@rsksmart/rns-resolver.js'
import Clipboard from '@react-native-community/clipboard'

import { ContactsIcon, ContentPasteIcon, QRCodeIcon } from '../icons'

import {
  validateAddress,
  AddressValidationMessage,
  toChecksumAddress,
} from './lib'
import { grid } from '../../styles/grid'
import { SquareButton } from '../button/SquareButton'
import { getTokenColor } from '../../screens/home/tokenColor'

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
  style?: any
  navigation: any
  showContacts: boolean
}

export const AddressInput: React.FC<AddressInputProps> = ({
  placeholder,
  value,
  onChangeText,
  testID,
  rnsResolver,
  navigation,
  showContacts,
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
  const selectedToken = 'TRBTC'

  return (
    <>
      <View style={grid.row}>
        <View style={{ ...grid.column6 }}>
          <TextInput
            style={styles.input}
            onChangeText={handleChangeText}
            value={value}
            placeholder={placeholder}
            testID={testID}
            editable={inputInfo !== 'Loading...'}
          />
        </View>
        <View style={{ ...grid.column2 }}>
          <View style={styles.centerRow}>
            <SquareButton
              onPress={async () =>
                handleChangeText(await Clipboard.getString())
              }
              title=""
              testID="Address.CopyButton"
              icon={<ContentPasteIcon color={getTokenColor(selectedToken)} />}
            />
          </View>
        </View>
        <View style={{ ...grid.column2 }}>
          <View style={styles.centerRow}>
            //TODO: implement QR code
            <SquareButton
              onPress={() => {}}
              title=""
              testID="Address.CopyButton"
              icon={<QRCodeIcon color={getTokenColor(selectedToken)} />}
            />
          </View>
        </View>
        {showContacts && (
          <View style={{ ...grid.column2 }}>
            <View style={styles.centerRow}>
              <SquareButton
                // @ts-ignore
                onPress={() => navigation.navigate('Contacts')}
                title=""
                icon={<ContactsIcon color={getTokenColor(selectedToken)} />}
              />
            </View>
          </View>
        )}
      </View>

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
  centerRow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    height: 50,
    marginTop: 10,
    margin: 10,
  },
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
