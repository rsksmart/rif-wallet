import { useCallback, useEffect, useState } from 'react'
import { Text, TextInput, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'
import { isValidChecksumAddress } from '@rsksmart/rsk-utils'

import { rnsResolver } from 'src/core/setup'
import { decodeString } from 'src/lib/eip681/decodeString'
import { colors, grid } from 'src/styles'
import { SecondaryButton } from '../button/SecondaryButton'
import { ContentPasteIcon, QRCodeIcon, DeleteIcon } from '../icons'
import { QRCodeScanner } from '../QRCodeScanner'
import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'
import { sharedAddressStyles as styles } from './sharedAddressStyles'

interface AddressInputProps {
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
  testID?: string
  chainId: number
  backgroundColor?: string
}

export const AddressInput = ({
  initialValue,
  onChangeText,
  testID,
  chainId,
  backgroundColor = colors.darkPurple5,
}: AddressInputProps) => {
  // the address of the recipient
  const [recipient, setRecipient] = useState<string>(initialValue)
  // hide or show the QR scanner
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false)
  const [domainFound, setDomainFound] = useState<string>('')
  const [addressResolved, setAddressResolved] = useState<string>('')

  // status
  const [status, setStatus] = useState<{
    type: 'READY' | 'INFO' | 'ERROR' | 'CHECKSUM'
    value?: string
  }>({ type: 'READY' })

  const handleChangeText = useCallback(
    (inputText: string) => {
      setStatus({ type: 'READY', value: '' })

      const parsedString = decodeString(inputText)
      const userInput = parsedString.address ? parsedString.address : inputText

      setRecipient(userInput)
      const newValidationMessage = validateAddress(userInput, chainId)

      onChangeText(
        userInput,
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
            .addr(userInput)
            .then((address: string) => {
              setDomainFound(userInput)
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
            .catch(_e =>
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
          onChangeText(userInput, false)
          break
      }
    },
    [chainId, onChangeText],
  )

  useEffect(() => {
    setRecipient(initialValue)
    if (initialValue) {
      handleChangeText(initialValue)
    } else {
      onChangeText(initialValue, isValidChecksumAddress(initialValue, chainId))
    }
  }, [chainId, handleChangeText, initialValue, onChangeText])

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
            <TouchableOpacity
              onPress={unselectDomain}
              accessibilityLabel="delete">
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
                  testID="Address.PasteButton"
                  accessibilityLabel="paste">
                  <ContentPasteIcon
                    color={colors.text.secondary}
                    height={22}
                    width={22}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowQRScanner(true)}
                  testID="Address.QRCodeButton"
                  accessibilityLabel="qr">
                  <QRCodeIcon color={colors.text.secondary} />
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleChangeText('')}
                testID="Address.ClearButton"
                accessibilityLabel="clear">
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
            <SecondaryButton
              testID={`${testID}.Button.Checksum`}
              accessibilityLabel="convert"
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
