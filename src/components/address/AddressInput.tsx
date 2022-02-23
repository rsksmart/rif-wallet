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

import { ContentPasteIcon, QRCodeIcon } from '../icons'

import {
  validateAddress,
  AddressValidationMessage,
  toChecksumAddress,
} from './lib'
import { grid } from '../../styles/grid'
import { rnsResolver } from '../../core/setup'
import QRScanner from '../qrScanner'
import { BarCodeReadEvent } from 'react-native-camera'
import { Button } from '../button'
import { colors } from '../../styles/colors'
import { TouchableOpacity } from 'react-native-gesture-handler'

type AddressInputProps = {
  initialValue: string
  onChangeText: (newValue: string) => void
  testID?: string
  chainId: number
}

export const AddressInput: React.FC<AddressInputProps> = ({
  initialValue,
  onChangeText,
  testID,
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
          setStatus({
            type: 'INFO',
            value: `Resolved to ${address}`,
          })

          // call parent with the resolved address
          onChangeText(address)
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
            placeholderTextColor={colors.gray}
          />

          <TouchableOpacity
            style={{ ...styles.button, ...styles.buttonPaste }}
            onPress={handlePasteClick}
            testID="Address.PasteButton">
            <ContentPasteIcon color={colors.white} height={20} width={20} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => setShowQRReader(true)}
            testID="Address.QRCodeButton">
            <QRCodeIcon color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>
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
      <View style={grid.row}>
        <View style={{ ...grid.column2, ...styles.iconColumn }} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {},
  iconColumn: {
    alignItems: 'flex-end',
  },
  inputContainer: {
    backgroundColor: colors.darkPurple2,
    borderRadius: 10,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
  },
  input: {
    flex: 5,
    height: 50,
    padding: 10,
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
  },
  button: {
    paddingTop: 15,
    paddingHorizontal: 10,
    flex: 1,
  },
  buttonPaste: {
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: colors.white,
  },
  cameraModal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
  cameraWrapper: {},
  info: {
    marginTop: 5,
    paddingHorizontal: 10,
    color: '#999',
  },
  error: {
    marginTop: 5,
    paddingHorizontal: 10,
    color: colors.orange,
  },
})
