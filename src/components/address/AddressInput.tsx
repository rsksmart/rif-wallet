import React, { useState, useEffect } from 'react'
import {
  Text,
  TextInput,
  StyleSheet,
  View,
  Modal,
  Dimensions,
} from 'react-native'
import Clipboard from '@react-native-community/clipboard'

import { ContactsIcon, ContentPasteIcon, QRCodeIcon } from '../icons'

import {
  validateAddress,
  AddressValidationMessage,
  toChecksumAddress,
} from './lib'
import { grid } from '../../styles/grid'
import { SquareButton } from '../button/SquareButton'
import { rnsResolver } from '../../core/setup'
import QRScanner from '../qrScanner'
import { BarCodeReadEvent } from 'react-native-camera'
import { Button } from '../button'

type AddressInputProps = {
  initialValue: string
  onChangeText: (newValue: string) => void
  testID: string
  navigation?: any
  showContactsIcon?: boolean
  chainId: number
  color?: string
}

export const AddressInput: React.FC<AddressInputProps> = ({
  initialValue,
  onChangeText,
  testID,
  navigation,
  showContactsIcon,
  color,
  chainId,
}) => {
  // the address of the recipient
  const [recipient, setRecipient] = useState<string>(initialValue)
  // hide or show the QR reader
  const [showQRReader, setShowQRReader] = useState<boolean>(false)

  const windowWidth = Dimensions.get('window').width

  useEffect(() => {
    setRecipient(initialValue)
    onChangeText(initialValue)
  }, [initialValue])

  // status
  const [status, setStatus] = useState<{
    type: 'READY' | 'INFO' | 'ERROR' | 'CHECKSUM'
    value?: string
  }>({ type: 'READY' })

  const iconColor = color || '#999'

  const handleChangeText = (inputText: string) => {
    setStatus({ type: 'READY' })
    setRecipient(inputText)
    onChangeText(inputText)

    const newValidationMessage = validateAddress(inputText)

    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      setStatus({
        type: 'INFO',
        value: 'Getting address for domain...',
      })

      rnsResolver
        .addr(inputText)
        .then((address: string) => {
          setRecipient(address)
          setStatus({
            type: 'INFO',
            value: `Resolved: ${inputText.toLowerCase()}`,
          })
        })
        .catch((_e: any) =>
          setStatus({
            type: 'ERROR',
            value: `Could not get address for ${inputText.toLowerCase()}`,
          }),
        )
    } else {
      if (newValidationMessage === AddressValidationMessage.INVALID_CHECKSUM) {
        setStatus({
          type: 'CHECKSUM',
          value: 'The checksum is invalid.',
        })
      }
      // user may still be typing...
    }
  }

  const handlePasteClick = () =>
    Clipboard.getString().then((value: string) => {
      setStatus({ type: 'READY' })
      setRecipient(value)
      validateCurrentInput(value)
    })

  // onUnFocus check the address is valid
  const validateCurrentInput = (input: string) => {
    if (validateAddress(input) === AddressValidationMessage.INVALID_ADDRESS) {
      setStatus({
        type: 'ERROR',
        value: 'The address is invalid',
      })
    }
  }

  return showQRReader ? (
    <Modal presentationStyle="overFullScreen" style={styles.cameraModal}>
      <View
        style={{
          ...styles.cameraWrapper,
          width: windowWidth,
          height: windowWidth,
        }}>
        <QRScanner
          onBarCodeRead={(event: BarCodeReadEvent) =>
            handleChangeText(decodeURIComponent(event.data))
          }
        />
        <Button onPress={() => setShowQRReader(false)} title="close" />
      </View>
    </Modal>
  ) : (
    <View style={styles.parent}>
      <View style={grid.row}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => handleChangeText(text)}
            onBlur={() => validateCurrentInput(recipient)}
            autoCapitalize="none"
            autoCorrect={false}
            value={recipient}
            placeholder="Address or RSK domain"
            testID={testID}
            editable={true}
          />
          {status.value && (
            <>
              <Text
                style={status.type === 'INFO' ? styles.info : styles.error}
                testID={testID + '.InputInfo'}>
                {status.value}
              </Text>
              {status.type === 'CHECKSUM' && (
                <Button
                  testID={`${testID}.Button.Checksum`}
                  title="Convert to correct checksum"
                  onPress={() =>
                    handleChangeText(toChecksumAddress(recipient, chainId))
                  }
                />
              )}
            </>
          )}
        </View>
      </View>
      <View style={grid.row}>
        <View style={{ ...grid.column2, ...styles.iconColumn }}>
          <SquareButton
            onPress={handlePasteClick}
            testID="Address.PasteButton"
            icon={<ContentPasteIcon color={iconColor} />}
          />
        </View>
        <View style={{ ...grid.column2, ...styles.iconColumn }}>
          <SquareButton
            onPress={() => setShowQRReader(true)}
            testID="Address.QRCodeButton"
            icon={<QRCodeIcon color={iconColor} />}
          />
        </View>
        {showContactsIcon && (
          <View style={{ ...grid.column2, ...styles.iconColumn }}>
            <SquareButton
              onPress={() => navigation.navigate('Contacts')}
              testID="Address.ContactsButton"
              icon={<ContactsIcon color={iconColor} />}
            />
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    marginHorizontal: 10,
  },
  iconColumn: {
    alignItems: 'flex-end',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    display: 'flex',
    width: '100%',
    paddingHorizontal: 10,
  },
  rnsText: {
    paddingHorizontal: 10,
    fontSize: 14,
    color: '#999',
    paddingBottom: 10,
  },
  input: {
    display: 'flex',
    height: 50,
    padding: 10,
  },
  cameraModal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cameraWrapper: {},
  info: {
    color: '#999',
  },
  error: {
    color: 'red',
  },
})
