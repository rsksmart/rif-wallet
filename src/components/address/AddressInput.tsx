import React, { useState, useEffect } from 'react'
import { Text, TextInput, StyleSheet, View, Modal } from 'react-native'
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

  // onUnFocus check the address is valid
  const validateCurrentInput = () => {
    if (
      validateAddress(recipient) === AddressValidationMessage.INVALID_ADDRESS
    ) {
      setStatus({
        type: 'ERROR',
        value: 'The address is invalid',
      })
    } else {
      onChangeText(initialValue)
    }
  }

  return showQRReader ? (
    <Modal style={styles.cameraContainer}>
      <View style={styles.cameraFrame}>
        <QRScanner
          onBarCodeRead={(event: BarCodeReadEvent) =>
            handleChangeText(decodeURIComponent(event.data))
          }
        />
      </View>
      <Button onPress={() => setShowQRReader(false)} title="close" />
    </Modal>
  ) : (
    <View style={styles.parent}>
      <View style={grid.row}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            onChangeText={text => handleChangeText(text)}
            onBlur={validateCurrentInput}
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
            onPress={async () => handleChangeText(await Clipboard.getString())}
            testID="Address.CopyButton"
            icon={<ContentPasteIcon color={iconColor} />}
          />
        </View>
        <View style={{ ...grid.column2, ...styles.iconColumn }}>
          <SquareButton
            onPress={() => setShowQRReader(true)}
            testID="Address.CopyButton"
            icon={<QRCodeIcon color={iconColor} />}
          />
        </View>
        {showContactsIcon && (
          <View style={{ ...grid.column2, ...styles.iconColumn }}>
            <SquareButton
              onPress={() => navigation.navigate('Contacts')}
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
  cameraFrame: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .1)',
    marginVertical: 40,
    padding: 20,
    borderRadius: 20,
  },
  cameraContainer: {
    flex: 1,
    alignItems: 'center',
  },
  info: {
    color: '#999',
  },
  error: {
    color: 'red',
  },
})
