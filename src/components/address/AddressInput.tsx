import { useCallback, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TextStyle } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { decodeString } from '@rsksmart/rif-wallet-eip681'
import { useTranslation } from 'react-i18next'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'

import { getRnsResolver } from 'core/setup'
import { sharedColors } from 'shared/constants'
import { Contact, ContactWithAddressRequired } from 'shared/types'
import { ChainTypesByIdType } from 'shared/constants/chainConstants'
import { castStyle } from 'shared/utils'
import { ContactCard } from 'screens/contacts/components'
import { ProposedContact } from 'screens/send/TransactionForm'

import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'
import { Input, InputProps } from '../input'
import { Avatar } from '../avatar'
import { AppButton } from '../button'

const bitcoinValidToAddressMessage = new Map([
  [true, AddressValidationMessage.VALID],
  [false, AddressValidationMessage.INVALID_ADDRESS],
])

export interface AddressInputProps extends Omit<InputProps, 'value'> {
  isBitcoin: boolean
  value: ContactWithAddressRequired
  onChangeAddress: (
    newValue: string,
    newDisplayValue: string,
    isValid: boolean,
  ) => void
  chainId: ChainTypesByIdType
  contactList?: Contact[]
  searchContacts?: (textString: string) => void
  onAddContact?: (contact: ProposedContact) => void
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

enum CoinType {
  RSK = 137,
  BTC = 0,
}

export const AddressInput = ({
  isBitcoin,
  label,
  placeholder,
  value,
  inputName,
  onChangeAddress,
  onAddContact,
  resetValue,
  testID,
  chainId,
  contactList,
}: AddressInputProps) => {
  const { t } = useTranslation()
  const [contactsFound, setContactsFound] = useState<Contact[] | null>(null)
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
    resetValue?.()
    setStatus(defaultStatus)
    setContactsFound(null)
  }, [resetValue])

  const searchContacts = useCallback(
    (textString: string) => {
      const array: Contact[] = []

      if (!contactList) {
        setContactsFound(null)
        return
      }

      for (const contact of contactList) {
        if (
          contact.name.toLowerCase().includes(textString.toLocaleLowerCase())
        ) {
          array.push(contact)
        }
      }

      if (array.length === 0) {
        setContactsFound(null)
        return
      }

      setContactsFound(array)
    },
    [contactList],
  )

  const setStatusCallChangeAddress = useCallback(
    (
      userInput: string,
      newValidationMessage: AddressValidationMessage,
      chainID: 30 | 31,
      isBTC: boolean,
    ) => {
      switch (newValidationMessage) {
        case AddressValidationMessage.DOMAIN:
          setStatus({
            type: Status.INFO,
            value: t('contact_form_getting_info'),
          })

          getRnsResolver(chainID)
            .addr(userInput, isBTC ? CoinType.BTC : CoinType.RSK)
            .then((resolvedAddress: string) => {
              setDomainFound(true)
              setStatus({
                type: Status.SUCCESS,
                value: t('contact_form_user_found'),
              })

              !contactsFound &&
                onAddContact?.({
                  address: resolvedAddress,
                  displayAddress: userInput,
                  isEditable: true,
                })

              // call parent with the resolved address
              onChangeAddress(
                resolvedAddress,
                userInput,
                !isBTC
                  ? validateAddress(resolvedAddress, chainID) ===
                      AddressValidationMessage.VALID
                  : isBitcoinAddressValid(resolvedAddress),
              )
            })
            .catch(_e =>
              setStatus({
                type: Status.ERROR,
                value: `${t(
                  'contact_form_address_not_found',
                )} ${userInput.toLowerCase()}`,
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
    [t, contactsFound, onChangeAddress, onAddContact],
  )

  const handleChangeText = useCallback(
    (inputText: string) => {
      if (inputText.length === 0) {
        resetState()
        return
      }

      setStatus(defaultStatus)

      const parsedString = decodeString(inputText)
      const userInput = parsedString.address ? parsedString.address : inputText
      const isBitcoinValid = isBitcoinAddressValid(userInput)
      const newValidationMessage = !isBitcoin
        ? validateAddress(userInput, chainId)
        : bitcoinValidToAddressMessage.get(isBitcoinValid)

      onChangeAddress(
        userInput,
        '',
        !isBitcoin
          ? newValidationMessage === AddressValidationMessage.VALID
          : isBitcoinValid,
      )

      if (!inputText) {
        return
      }

      // search for the contacts using user typed string
      // present options under input
      searchContacts?.(userInput)

      setStatusCallChangeAddress(
        userInput,
        newValidationMessage!,
        chainId,
        isBitcoin,
      )
    },
    [
      chainId,
      isBitcoin,
      onChangeAddress,
      resetState,
      searchContacts,
      setStatusCallChangeAddress,
    ],
  )

  const unselectDomain = useCallback(() => {
    resetState()
    handleChangeText('')
  }, [handleChangeText, resetState])

  const handlePasteClick = useCallback(async () => {
    const copyValue = await Clipboard.getString()
    handleChangeText(copyValue)
  }, [handleChangeText])

  useEffect(() => {
    // only needs to run once
    // when initial value is set in TransactionForm
    handleChangeText(value.address)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetAddressValue = useCallback(() => {
    unselectDomain()
    resetValue && resetValue()
    setContactsFound(null)
  }, [resetValue, unselectDomain])

  const onContactPress = useCallback(
    (contact: Contact) => {
      setStatusCallChangeAddress(
        contact.displayAddress,
        AddressValidationMessage.DOMAIN,
        chainId,
        isBitcoin,
      )
      setContactsFound(null)
    },
    [chainId, isBitcoin, setStatusCallChangeAddress],
  )

  return (
    <>
      <Input
        accessibilityLabel={testID}
        label={status.value ? status.value : label}
        labelStyle={labelColor}
        value={!value.displayAddress ? value.address : value.displayAddress}
        subtitle={!value.displayAddress ? undefined : value.address}
        inputName={inputName}
        onChangeText={handleChangeText}
        resetValue={resetAddressValue}
        autoCorrect={false}
        autoCapitalize={'none'}
        placeholder={placeholder}
        placeholderTextColor={sharedColors.inputLabelColor}
        rightIcon={
          !(value.address || value.displayAddress)
            ? {
                name: 'copy',
                size: 16,
              }
            : undefined
        }
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
      {contactsFound ? (
        <ScrollView horizontal style={styles.contactList}>
          {contactsFound.map(c => (
            <ContactCard
              key={c.name}
              style={styles.contactCard}
              name={c.name}
              onPress={() => onContactPress(c)}
            />
          ))}
        </ScrollView>
      ) : null}
    </>
  )
}

const styles = StyleSheet.create({
  contactList: castStyle.view({
    marginTop: 6,
    padding: 6,
  }),
  contactCard: castStyle.view({ marginHorizontal: 6 }),
})
