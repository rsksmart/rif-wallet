import { useCallback, useEffect, useMemo, useState } from 'react'
import { TextStyle } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { decodeString } from '@rsksmart/rif-wallet-eip681'
import { useTranslation } from 'react-i18next'

import { getRnsResolver } from 'core/setup'
import { sharedColors } from 'shared/constants'
import { ContactWithAddressRequired } from 'shared/types'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'

import { QRCodeScanner } from '../QRCodeScanner'
import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'
import { Input, InputProps } from '../input'
import { Avatar } from '../avatar'
import { AppButton } from '../button'

export interface AddressInputProps extends Omit<InputProps, 'value'> {
  value: ContactWithAddressRequired
  onChangeAddress: (
    newValue: string,
    newDisplayValue: string,
    isValid: boolean,
  ) => void
  chainId: ChainTypesByIdType
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
  value,
  inputName,
  onChangeAddress,
  testID,
  chainId,
  resetValue,
}: AddressInputProps) => {
  const { t } = useTranslation()
  const [showQRScanner, setShowQRScanner] = useState<boolean>(false)
  const [domainFound, setDomainFound] = useState<boolean>(false)
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
    onChangeAddress('', '', false)
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
      const newValidationMessage = validateAddress(userInput, chainId)

      onChangeAddress(
        userInput,
        '',
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

          getRnsResolver(chainId)
            .addr(userInput)
            .then((resolvedAddress: string) => {
              setDomainFound(true)
              setStatus({
                type: Status.SUCCESS,
                value: t('contact_form_user_found'),
              })

              // call parent with the resolved address
              onChangeAddress(
                resolvedAddress,
                userInput,
                validateAddress(resolvedAddress, chainId) ===
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
          onChangeAddress('', userInput, false)
          break
      }
    },
    [chainId, onChangeAddress, resetState, t],
  )

  const unselectDomain = useCallback(() => {
    resetState()
    handleChangeText('')
  }, [handleChangeText, resetState])

  const handlePasteClick = useCallback(async () => {
    const copyValue = await Clipboard.getString()
    handleChangeText(copyValue)
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

  useEffect(() => {
    // only needs to run once
    // when initial value is set in TransactionForm
    handleChangeText(value.address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleChangeText])

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
        value={!value.displayAddress ? value.address : value.displayAddress}
        subtitle={!value.displayAddress ? undefined : value.address}
        inputName={inputName}
        onChangeText={handleChangeText}
        onBlur={() => validateCurrentInput(value.address)}
        resetValue={resetAddressValue}
        autoCorrect={false}
        autoCapitalize={'none'}
        placeholder={placeholder}
        placeholderTextColor={sharedColors.inputLabelColor}
        rightIcon={!value.address ? { name: 'copy', size: 16 } : undefined}
        onRightIconPress={handlePasteClick}
        leftIcon={
          value.displayAddress && domainFound ? (
            <Avatar name={value.displayAddress} size={28} />
          ) : undefined
        }
      />
      {status.value ? (
        <>
          {status.type === Status.CHECKSUM && (
            <AppButton
              testID={`${testID}.Button.Checksum`}
              accessibilityLabel="convert"
              title={t('contact_form_button_convert_checksum')}
              onPress={() =>
                handleChangeText(toChecksumAddress(value.address, chainId))
              }
            />
          )}
        </>
      ) : null}
    </>
  )
}
