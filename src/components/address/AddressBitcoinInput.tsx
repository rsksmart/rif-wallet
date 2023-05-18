import Clipboard from '@react-native-community/clipboard'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'
import { useTranslation } from 'react-i18next'

import { rnsResolver } from 'core/setup'
import { QRCodeScanner } from '../QRCodeScanner'
import { RegularText } from '../typography'
import { isDomain } from './lib'
import { sharedAddressStyles } from './sharedAddressStyles'
import { Input } from '../input'
import { AppTouchable } from '../appTouchable'
import { AddressInputProps } from './AddressInput'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'

enum TYPES {
  NORMAL = 'NORMAL',
  DOMAIN = 'DOMAIN',
  ADDRESS = 'ADDRESS',
}

interface TO {
  value: string
  type: TYPES
  addressResolved: string
}

export const AddressBitcoinInput = ({
  label,
  placeholder,
  inputName,
  testID,
  initialValue = '',
  onChangeAddress,
  resetValue,
}: AddressInputProps) => {
  const { t } = useTranslation()
  const [to, setTo] = useState<TO>({
    value: initialValue,
    type: TYPES.NORMAL,
    addressResolved: '',
  })
  const [shouldShowQRScanner, setShouldShowQRScanner] = useState<boolean>(false)
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [isUserWriting, setIsUserWriting] = useState(false)
  const [isValidating, setIsValidating] = useState(false)

  const invalidAddressCondition = useMemo(
    () => to.value !== '' && !isUserWriting && !isAddressValid && !isValidating,
    [isUserWriting, isAddressValid, isValidating, to.value],
  )

  const handleUserIsWriting = useCallback((isWriting = true) => {
    setIsUserWriting(isWriting)
  }, [])
  const hideQRScanner = useCallback(() => setShouldShowQRScanner(false), [])

  // const showQRScanner = useCallback(() => setShouldShowQRScanner(true), [])

  const onBeforeChangeText = useCallback(
    (address: string) => {
      const isBtcAddressValid = isBitcoinAddressValid(address)
      setIsAddressValid(isBtcAddressValid)
      onChangeAddress(address, isBtcAddressValid)
    },
    [onChangeAddress],
  )

  /* set  */
  const handleChangeText = useCallback(
    (text: string) => {
      onBeforeChangeText(text)
      setTo({ ...to, value: text, type: TYPES.NORMAL })
    },
    [setTo, to, onBeforeChangeText],
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

  const onBlurValidate = useCallback(() => {
    handleUserIsWriting(false)
    validateAddress(to.value)
  }, [to.value, validateAddress, handleUserIsWriting])

  const handlePasteClick = useCallback(
    () => Clipboard.getString().then(validateAddress),
    [validateAddress],
  )

  const onClearText = useCallback(() => {
    handleChangeText('')
    resetValue && resetValue()
  }, [handleChangeText, resetValue])

  useEffect(() => {
    onBeforeChangeText(initialValue)
  }, [initialValue, onBeforeChangeText])

  return (
    <>
      {shouldShowQRScanner && (
        <QRCodeScanner onClose={hideQRScanner} onCodeRead={onQRRead} />
      )}
      {to.type === TYPES.DOMAIN && (
        <View style={sharedAddressStyles.rnsDomainContainer}>
          <View>
            <RegularText style={sharedAddressStyles.rnsDomainName}>
              {to.addressResolved}
            </RegularText>
            <RegularText style={sharedAddressStyles.rnsDomainAddress}>
              {to.value}
            </RegularText>
          </View>
          <View style={sharedAddressStyles.rnsDomainUnselect}>
            <AppTouchable
              width={20}
              onPress={onClearText}
              accessibilityLabel={'delete'}>
              <Icon name={'trash-alt'} size={20} color={sharedColors.white} />
            </AppTouchable>
          </View>
        </View>
      )}
      {to.type === TYPES.NORMAL && (
        <Input
          label={
            invalidAddressCondition
              ? t('contact_form_address_invalid')
              : isValidating
              ? t('address_validating')
              : label
          }
          labelStyle={
            invalidAddressCondition ? styles.labelDanger : styles.label
          }
          inputName={inputName}
          placeholder={placeholder}
          testID={testID}
          autoCorrect={false}
          editable={true}
          autoCapitalize={'none'}
          rightIcon={to.value === '' ? { name: 'copy', size: 16 } : undefined}
          resetValue={onClearText}
          onChangeText={handleChangeText}
          onBlur={onBlurValidate}
          onFocus={handleUserIsWriting}
          onRightIconPress={handlePasteClick}
        />
      )}
    </>
  )
}

const styles = StyleSheet.create({
  labelDanger: castStyle.text({ color: sharedColors.danger }),
  label: castStyle.text({
    color: sharedColors.inputLabelColor,
  }),
})
