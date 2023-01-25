import Clipboard from '@react-native-community/clipboard'
import { useCallback, useEffect, useState } from 'react'
import { TextInput, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/Ionicons'

import { isBitcoinAddressValid } from 'lib/bitcoin/utils'

import { rnsResolver } from 'core/setup'
import { colors } from 'src/styles'

import { ContentPasteIcon, DeleteIcon, QRCodeIcon } from '../icons'
import { QRCodeScanner } from '../QRCodeScanner'
import { MediumText, RegularText } from '../typography'
import { isDomain } from './lib'
import { sharedAddressStyles as styles } from './sharedAddressStyles'

interface AddressInputProps {
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
  testID?: string
}

const TYPES = {
  NORMAL: 'NORMAL',
  DOMAIN: 'DOMAIN',
}

export const AddressBitcoinInput = ({
  initialValue = '',
  onChangeText,
}: AddressInputProps) => {
  const [to, setTo] = useState({
    value: initialValue,
    type: TYPES.NORMAL,
    addressResolved: '',
  })
  const [shouldShowQRScanner, setShouldShowQRScanner] = useState<boolean>(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [isUserWriting, setIsUserWriting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)
  const handleUserIsWriting = useCallback((isWriting = true) => {
    setIsUserWriting(isWriting)
  }, [])
  const hideQRScanner = useCallback(() => setShouldShowQRScanner(false), [])

  const showQRScanner = useCallback(() => setShouldShowQRScanner(true), [])

  /* set  */
  const handleChangeText = useCallback(
    (text: string) => {
      setTo({ ...to, value: text, type: TYPES.NORMAL })
    },
    [setTo, to],
  )

  const onBeforeChangeText = useCallback(
    (address: string) => {
      const isBtcAddressValid = isBitcoinAddressValid(address)
      setIsAddressValid(isBtcAddressValid)
      onChangeText(address, isBtcAddressValid)
    },
    [onChangeText],
  )

  /* Function to validate address and to set it */
  const validateAddress = useCallback(
    (text: string) => {
      // If domain, fetch it
      setIsValidating(true)
      if (isDomain(text)) {
        rnsResolver
          .addr(text)
          .then((address: string) => {
            setTo({
              value: address,
              type: TYPES.DOMAIN,
              addressResolved: text,
            })
            onBeforeChangeText(address)
          })
          .catch(_e => {})
          .finally(() => setIsValidating(false))
      } /* default to normal validation */ else {
        onBeforeChangeText(text)
        setTo({
          value: text,
          type: TYPES.NORMAL,
          addressResolved: text,
        })
        setIsValidating(false)
      }
    },
    [onBeforeChangeText],
  )

  const onQRRead = useCallback(
    (qrText: string) => {
      validateAddress(qrText)
      hideQRScanner()
    },
    [hideQRScanner, validateAddress],
  )

  const onBlurValidate = () => {
    handleUserIsWriting(false)
    validateAddress(to.value)
  }

  const handlePasteClick = () => Clipboard.getString().then(validateAddress)

  const onClearText = useCallback(
    () => handleChangeText(''),
    [handleChangeText],
  )

  useEffect(() => {
    onBeforeChangeText(initialValue)
  }, [initialValue, onBeforeChangeText])

  return (
    <>
      {shouldShowQRScanner && (
        <QRCodeScanner onClose={hideQRScanner} onCodeRead={onQRRead} />
      )}
      {to.type === TYPES.DOMAIN && (
        <View style={styles.rnsDomainContainer}>
          <View>
            <RegularText style={styles.rnsDomainName}>
              {to.addressResolved}
            </RegularText>
            <RegularText style={styles.rnsDomainAddress}>
              {to.value}
            </RegularText>
          </View>
          <View style={styles.rnsDomainUnselect}>
            <TouchableOpacity onPress={onClearText} accessibilityLabel="delete">
              <DeleteIcon color={'black'} width={20} height={20} />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {to.type !== TYPES.DOMAIN && (
        <View style={styles.inputContainer}>
          {to.type === TYPES.NORMAL && (
            <TextInput
              style={styles.input}
              onChangeText={handleChangeText}
              onBlur={onBlurValidate}
              onFocus={handleUserIsWriting}
              autoCapitalize="none"
              autoCorrect={false}
              value={to.value}
              placeholder="address or rns domain"
              testID={'AddressBitcoinInput.Text'}
              editable={true}
              placeholderTextColor={colors.text.secondary}
            />
          )}
          {to.value === '' && to.type !== TYPES.DOMAIN && (
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
                onPress={showQRScanner}
                testID="Address.QRCodeButton">
                <QRCodeIcon color={colors.text.secondary} />
              </TouchableOpacity>
            </>
          )}
          {to.value !== '' && to.type !== TYPES.DOMAIN && (
            <TouchableOpacity
              style={styles.button}
              onPress={onClearText}
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
      )}
      {to.value !== '' &&
        !isUserWriting &&
        !isAddressValid &&
        !isValidating && (
          <MediumText style={styles.invalidAddressText}>
            Address is not valid
          </MediumText>
        )}
      {isValidating && (
        <MediumText style={styles.invalidAddressText}>Validating...</MediumText>
      )}
    </>
  )
}
