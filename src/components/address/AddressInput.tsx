import { useCallback, useEffect, useMemo, useState } from 'react'
import Clipboard from '@react-native-community/clipboard'
import { isValidChecksumAddress } from '@rsksmart/rsk-utils'
import { decodeString } from '@rsksmart/rif-wallet-eip681'
import { useTranslation } from 'react-i18next'

import { rnsResolver } from 'src/core/setup'
import { colors } from 'src/styles'
import { SecondaryButton } from '../button/SecondaryButton'
import { QRCodeScanner } from '../QRCodeScanner'
import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'
import { Input, InputProps } from '../input'
import { Avatar } from '../avatar'
import { sharedColors } from 'src/shared/constants'
import { TextStyle } from 'react-native'

export interface AddressInputProps extends InputProps {
  initialValue: string
  onChangeAddress: (newValue: string, isValid: boolean) => void
  chainId: number
}

enum Status {
  READY = 'READY',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CHECKSUM = 'CHECKSUM',
}

const typeColorMap = new Map([
  [Status.ERROR, sharedColors.danger],
  [Status.SUCCESS, sharedColors.success],
  [Status.INFO, sharedColors.inputLabelColor],
])

const defaultStatus = { type: Status.READY, value: '' }

export const AddressInput = ({
  label,
  placeholder,
  initialValue,
  inputName,
  onChangeAddress,
  testID,
  chainId,
  resetValue,
}: AddressInputProps) => {
  const { t } = useTranslation()
  // the address of the recipient
  const [recipient, setRecipient] = useState<string>(initialValue)
  // hide or show the QR scanner
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false)
  const [domainFound, setDomainFound] = useState<boolean>(false)
  const [addressResolved, setAddressResolved] = useState<string>('')
  // status
  const [status, setStatus] = useState<{
    type: Status
    value?: string
  }>({ type: Status.READY })

  const labelColor = useMemo<TextStyle>(() => {
    return typeColorMap.get(status.type)
      ? { color: typeColorMap.get(status.type) }
      : { color: typeColorMap.get(Status.INFO) }
  }, [status.type])

  const resetState = useCallback(() => {
    setDomainFound(false)
    setAddressResolved('')
    onChangeAddress('', false)
    setStatus(defaultStatus)
  }, [onChangeAddress])

  const handleChangeText = useCallback(
    (inputText: string) => {
      if (inputText.length === 0) {
        resetState()
      }

      setStatus(defaultStatus)

      const parsedString = decodeString(inputText)
      const userInput = parsedString.address ? parsedString.address : inputText

      setRecipient(userInput)
      const newValidationMessage = validateAddress(userInput, chainId)

      onChangeAddress(
        userInput,
        newValidationMessage === AddressValidationMessage.VALID,
      )

      if (!inputText) {
        return
      }

      switch (newValidationMessage) {
        case AddressValidationMessage.DOMAIN:
          setStatus({
            type: Status.INFO,
            value: t('contact_form_getting_info'),
          })

          rnsResolver
            .addr(userInput)
            .then((address: string) => {
              setDomainFound(true)
              setAddressResolved(address)
              setStatus({
                type: Status.SUCCESS,
                value: t('contact_form_user_found'),
              })

              // call parent with the resolved address
              onChangeAddress(
                userInput,
                validateAddress(address, chainId) ===
                  AddressValidationMessage.VALID,
              )
            })
            .catch(_e =>
              setStatus({
                type: Status.ERROR,
                value: `${t(
                  'contact_form_address_not_found',
                )} ${inputText.toLowerCase()}`,
              }),
            )
          break
        case AddressValidationMessage.INVALID_CHECKSUM:
          setStatus({
            type: Status.CHECKSUM,
            value: t('contact_form_checksum_invalid'),
          })
          break
        case AddressValidationMessage.INVALID_ADDRESS:
          setStatus({
            type: Status.ERROR,
            value: t('contact_form_address_invalid'),
          })
          onChangeAddress(userInput, false)
          break
      }
    },
    [chainId, onChangeAddress, resetState, t],
  )

  const unselectDomain = useCallback(() => {
    resetState()
    handleChangeText('')
  }, [handleChangeText, resetState])

  useEffect(() => {
    setRecipient(initialValue)
    if (initialValue) {
      handleChangeText(initialValue)
    } else {
      onChangeAddress(
        initialValue,
        isValidChecksumAddress(initialValue, chainId),
      )
    }
  }, [chainId, handleChangeText, onChangeAddress, initialValue])

  const handlePasteClick = useCallback(async () => {
    const value = await Clipboard.getString()
    handleChangeText(value)
  }, [handleChangeText])

  // onBlur check the address is valid
  const validateCurrentInput = useCallback(
    (input: string) => {
      if (validateAddress(input) === AddressValidationMessage.INVALID_ADDRESS) {
        setStatus({
          type: Status.ERROR,
          value: t('contact_form_address_invalid'),
        })
      }
    },
    [t],
  )

  const resetAddressValue = useCallback(() => {
    unselectDomain()
    resetValue && resetValue()
  }, [resetValue, unselectDomain])

  return showQRScanner ? (
    <QRCodeScanner
      onClose={() => setShowQRScanner(false)}
      onCodeRead={data => {
        handleChangeText(data)
        setShowQRScanner(false)
      }}
    />
  ) : (
    <>
      <Input
        testID={testID}
        label={status.value ? status.value : label}
        labelStyle={labelColor}
        subtitle={addressResolved && recipient ? addressResolved : undefined}
        inputName={inputName}
        onChangeText={handleChangeText}
        onBlur={() => validateCurrentInput(recipient)}
        resetValue={resetAddressValue}
        autoCorrect={false}
        autoCapitalize={'none'}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        rightIcon={!recipient ? { name: 'copy', size: 16 } : undefined}
        onRightIconPress={handlePasteClick}
        leftIcon={
          recipient && domainFound ? (
            <Avatar name={recipient} size={28} />
          ) : undefined
        }
      />
      {status.value ? (
        <>
          {status.type === Status.CHECKSUM && (
            <SecondaryButton
              testID={`${testID}.Button.Checksum`}
              accessibilityLabel="convert"
              title={t('contact_form_button_checksum')}
              onPress={() =>
                handleChangeText(toChecksumAddress(recipient, chainId))
              }
            />
          )}
        </>
      ) : null}
    </>
  )
}
