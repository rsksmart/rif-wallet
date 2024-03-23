import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ScrollView, StyleSheet, TextStyle } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'
import { decodeString } from '@rsksmart/rif-wallet-eip681'
import { useTranslation } from 'react-i18next'
import { isBitcoinAddressValid } from '@rsksmart/rif-wallet-bitcoin'
import { Network } from 'bitcoin-address-validation'

import { ChainID } from 'lib/eoaWallet'

import { getRnsResolver } from 'core/setup'
import { sharedColors } from 'shared/constants'
import { Contact, ContactWithAddressRequired } from 'shared/types'
import { castStyle } from 'shared/utils'
import { ContactCard } from 'screens/contacts/components'
import { ProposedContact } from 'screens/send/TransactionForm'
import { checkIfContactExists } from 'screens/contacts/ContactFormScreen'
import { WalletContext } from 'src/shared/wallet'

import {
  AddressValidationMessage,
  toChecksumAddress,
  validateAddress,
} from './lib'
import { Input, InputProps } from '../input'
import { Avatar } from '../avatar'
import { AppButton } from '../button'

export interface AddressInputProps extends Omit<InputProps, 'value'> {
  isBitcoin?: boolean
  value: ContactWithAddressRequired
  onChangeAddress: (
    newValue: string,
    newDisplayValue: string,
    isValid: boolean,
  ) => void
  chainId: ChainID
  contactList?: Contact[]
  onSetLoadingRNS?: (isLoading: boolean) => void
  searchContacts?: (textString: string) => void
  onSetProposedContact?: (contact: ProposedContact) => void
}

enum Status {
  READY = 'READY',
  INFO = 'INFO',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  CHECKSUM = 'CHECKSUM',
}

interface StatusObject {
  type: Status
  value?: string
}

const typeColorMap = new Map([
  [Status.ERROR, sharedColors.danger],
  [Status.SUCCESS, sharedColors.success],
  [Status.INFO, sharedColors.inputLabelColor],
])

const defaultStatus = { type: Status.READY, value: '' }

export const AddressInput = ({
  isBitcoin = false,
  label,
  placeholder,
  value,
  inputName,
  onChangeAddress,
  onSetProposedContact,
  onSetLoadingRNS,
  resetValue,
  testID,
  chainId,
  contactList,
}: AddressInputProps) => {
  const { t } = useTranslation()
  const [contactsFound, setContactsFound] = useState<Contact[] | null>(null)
  const [domainFound, setDomainFound] = useState<boolean>(false)
  // status
  const [status, setStatus] = useState<StatusObject>({ type: Status.READY })
  const { wallet } = useContext(WalletContext)

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
        if (contact.name.toLowerCase().includes(textString.toLowerCase())) {
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

          // send loading state to parent
          onSetLoadingRNS?.(true)

          if (wallet) {
            getRnsResolver(chainID, wallet)
              .addr(userInput)
              .then((addr: string) => {
                const resolvedAddress = toChecksumAddress(addr, chainID)
                setDomainFound(true)
                setStatus({
                  type: Status.SUCCESS,
                  value: t('contact_form_user_found'),
                })

                // send loading state to parent
                onSetLoadingRNS?.(false)

                if (contactList) {
                  const contactExists = checkIfContactExists(
                    resolvedAddress,
                    userInput,
                    contactList,
                  )

                  !contactExists &&
                    onSetProposedContact?.({
                      address: resolvedAddress,
                      displayAddress: userInput,
                      isEditable: true,
                    })
                }

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
              .catch(_e => {
                setStatus({
                  type: Status.ERROR,
                  value: `${t(
                    'contact_form_address_not_found',
                  )} ${userInput.toLowerCase()}`,
                })

                // send loading state to parent
                onSetLoadingRNS?.(false)
              })
          }
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
        case AddressValidationMessage.WRONG_NETWORK:
          setStatus({
            type: Status.ERROR,
            value: t('contact_form_network_wrong'),
          })
          onChangeAddress('', userInput, false)
          break
      }
    },
    [
      t,
      onSetLoadingRNS,
      wallet,
      onChangeAddress,
      contactList,
      onSetProposedContact,
    ],
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

      let validationMessage: AddressValidationMessage
      if (isBitcoin) {
        if (isBitcoinValid) {
          const network = chainId === 30 ? Network.mainnet : Network.testnet
          const isNetworkValid = isBitcoinAddressValid(userInput, network)
          validationMessage = isNetworkValid
            ? AddressValidationMessage.VALID
            : AddressValidationMessage.WRONG_NETWORK
        } else {
          validationMessage = AddressValidationMessage.INVALID_ADDRESS
        }
      } else {
        validationMessage = validateAddress(userInput, chainId)
      }

      onChangeAddress(
        userInput,
        '',
        isBitcoin
          ? isBitcoinValid
          : validationMessage === AddressValidationMessage.VALID,
      )

      if (!inputText) {
        return
      }

      // search for the contacts using user typed string
      // present options under input
      searchContacts?.(userInput)

      setStatusCallChangeAddress(
        userInput,
        validationMessage,
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
        label={status.value || label}
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
