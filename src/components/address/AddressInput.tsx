import Clipboard from '@react-native-community/clipboard'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import { sharedAddressStyles as styles } from './sharedAddressStyles'
import { ContentPasteIcon, QRCodeIcon } from '../icons'

import { isValidChecksumAddress } from '@rsksmart/rsk-utils'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { rnsResolver } from '../../core/setup'
import { colors, grid } from '../../styles'
import { OutlineButton } from '../button/ButtonVariations'
import DeleteIcon from '../icons/DeleteIcon'
import { QRCodeScanner } from '../QRCodeScanner'
import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'

type AddressInputProps = {
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
  testID?: string
  chainId: number
  backgroundColor?: string
}

export const AddressInput: React.FC<AddressInputProps> = ({
  initialValue,
  onChangeText,
  testID,
  chainId,
  backgroundColor = colors.darkPurple5,
}) => {
  // the address of the recipient
  const [recipient, setRecipient] = useState<string>(initialValue)
  // hide or show the QR scanner
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false)
  const [domainFound, setDomainFound] = useState<string>('')
  const [addressResolved, setAddressResolved] = useState<string>('')

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

    const newValidationMessage = validateAddress(inputText, chainId)

    onChangeText(
      inputText,
      newValidationMessage === AddressValidationMessage.VALID,
    )

    if (!inputText) {
      return
    }

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
        onChangeText(inputText, true)
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

  return showQRScanner ? (
    <QRCodeScanner
      onClose={() => setShowQRScanner(false)}
      onCodeRead={data => {
        handleChangeText(data)
        setShowQRScanner(false)
      }}
    />
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
          <View style={{ ...styles.inputContainer, backgroundColor }}>
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
              placeholderTextColor={colors.text.secondary}
            />

            {!recipient ? (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={handlePasteClick}
                  testID="Address.PasteButton">
                  <ContentPasteIcon
                    color={colors.text.secondary}
                    height={22}
                    width={22}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowQRScanner(true)}
                  testID="Address.QRCodeButton">
                  <QRCodeIcon color={colors.text.secondary} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeText('')}
                testID="Address.ClearButton">
                <View style={styles.clearButtonView}>
                  <Icon
                    name="close-outline"
                    style={styles.clearButton}
                    size={15}
                  />
                </View>
              </TouchableOpacity>
            )}
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
