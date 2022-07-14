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
import { grid } from '../../styles'
import { rnsResolver } from '../../core/setup'
import QRScanner from '../qrScanner'
import { BarCodeReadEvent } from 'react-native-camera'
import { Button } from '../button'
import { colors } from '../../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { isValidChecksumAddress } from '@rsksmart/rsk-utils'
import { OutlineButton } from '../button/ButtonVariations'
import DeleteIcon from '../icons/DeleteIcon'

type AddressInputProps = {
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
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
  const [domainFound, setDomainFound] = useState<string>('')
  const [addressResolved, setAddressResolved] = useState<string>('')

  const windowWidth = Dimensions.get('window').width

  useEffect(() => {
    setRecipient(initialValue)
    if (initialValue) {
      handleChangeText(initialValue)
    } else {
      onChangeText(initialValue, isValidChecksumAddress(initialValue, chainId))
    }
  }, [])

  // status
  const [status, setStatus] = useState<{
    type: 'READY' | 'INFO' | 'ERROR' | 'CHECKSUM'
    value?: string
  }>({ type: 'READY' })

  const handleChangeText = (inputText: string) => {
    setStatus({ type: 'READY', value: '' })
    setRecipient(inputText)

    // console.log(inputText)

    const newValidationMessage = validateAddress(inputText, chainId)

    onChangeText(
      inputText,
      newValidationMessage === AddressValidationMessage.VALID,
    )

    switch (newValidationMessage) {
      case AddressValidationMessage.DOMAIN:
        setStatus({
          type: 'INFO',
          value: 'Getting address for domain...',
        })

        rnsResolver
          .addr(inputText)
          .then((address: string) => {
            setDomainFound(inputText)
            setAddressResolved(address)
            setStatus({
              type: 'INFO',
              value: 'RNS domain associated with this address',
            })

            // call parent with the resolved address
            onChangeText(
              address,
              validateAddress(address, chainId) ===
                AddressValidationMessage.VALID,
            )
          })
          .catch((_e: any) =>
            setStatus({
              type: 'ERROR',
              value: `Could not get address for ${inputText.toLowerCase()}`,
            }),
          )
        break
      case AddressValidationMessage.INVALID_CHECKSUM:
        setStatus({
          type: 'CHECKSUM',
          value: 'The checksum is invalid.',
        })
        break
      case AddressValidationMessage.INVALID_ADDRESS:
        setStatus({
          type: 'ERROR',
          value: 'Invalid address',
        })
        onChangeText(inputText, false)
        break
    }
  }

  const handlePasteClick = () =>
    Clipboard.getString().then((value: string) => {
      setStatus({ type: 'READY' })
      handleChangeText(value)
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

  const unselectDomain = () => {
    setDomainFound('')
    handleChangeText('')
    setStatus({ type: 'READY', value: '' })
  }

  return showQRReader ? (
    <Modal presentationStyle="overFullScreen" style={styles.cameraModal}>
      <View
        style={{
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
      {!!domainFound && (
        <View style={styles.rnsDomainContainer}>
          <View>
            <Text style={styles.rnsDomainName}> {domainFound}</Text>
            <Text style={styles.rnsDomainAddress}>{addressResolved}</Text>
          </View>
          <View style={styles.rnsDomainUnselect}>
            <TouchableOpacity onPress={unselectDomain}>
              <DeleteIcon color={'black'} width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!domainFound && (
        <View style={grid.row}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              onChangeText={handleChangeText}
              onBlur={() => validateCurrentInput(recipient)}
              autoCapitalize="none"
              autoCorrect={false}
              value={recipient}
              placeholder="address or rns domain"
              testID={testID}
              editable={true}
              placeholderTextColor={colors.gray}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handlePasteClick}
              testID="Address.PasteButton">
              <ContentPasteIcon color={colors.white} height={22} width={22} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowQRReader(true)}
              testID="Address.QRCodeButton">
              <QRCodeIcon color={colors.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {!!status.value && (
        <>
          <Text
            style={status.type === 'INFO' ? styles.info : styles.error}
            testID={testID + '.InputInfo'}>
            {status.value}
          </Text>
          {status.type === 'CHECKSUM' && (
            <OutlineButton
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
  rnsDomainContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: colors.lightGray,
    borderRadius: 15,
  },
  rnsDomainName: {
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 3,
  },
  rnsDomainUnselect: {
    margin: 3,
  },
  rnsDomainAddress: {
    marginLeft: 4,
    fontSize: 11,
  },
  inputContainer: {
    backgroundColor: colors.darkPurple5,
    borderRadius: 15,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 20,
  },
  input: {
    flex: 5,
    fontSize: 16,
    fontWeight: '400',
    color: colors.white,
  },
  button: {
    paddingHorizontal: 5,
    flex: 1,
  },
  buttonPaste: {
    paddingRight: 5,
  },
  cameraModal: {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
  },
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
