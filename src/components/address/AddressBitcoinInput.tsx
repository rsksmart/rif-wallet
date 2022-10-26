import React, { useState } from 'react'
import { QRCodeScanner } from '../QRCodeScanner'
import { sharedAddressStyles as styles } from './sharedAddressStyles'
import { Text, TextInput, View } from 'react-native'
import { colors } from '../../styles'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ContentPasteIcon, QRCodeIcon } from '../icons'
import Icon from 'react-native-vector-icons/Ionicons'
import Clipboard from '@react-native-community/clipboard'
import { isDomain } from './lib'
import { rnsResolver } from '../../core/setup'
import { isBitcoinAddressValid } from '../../lib/bitcoin/utils'
import BitcoinNetwork from '../../lib/bitcoin/BitcoinNetwork'
import DeleteIcon from '../icons/DeleteIcon'

type AddressInputProps = {
  initialValue: string
  onChangeText: (newValue: string, isValid: boolean) => void
  testID?: string
  backgroundColor?: string
  token: BitcoinNetwork
}

const TYPES = {
  NORMAL: 'NORMAL',
  DOMAIN: 'DOMAIN',
}

export const AddressBitcoinInput: React.FC<AddressInputProps> = ({
  initialValue = '',
  onChangeText,
  token,
}) => {
  const [to, setTo] = useState<any>({
    value: initialValue,
    type: TYPES.NORMAL,
    addressResolved: '',
  })
  const [shouldShowQRScanner, setShouldShowQRScanner] = useState<boolean>(false)

  const hideQRScanner = React.useCallback(
    () => setShouldShowQRScanner(false),
    [],
  )

  const showQRScanner = React.useCallback(
    () => setShouldShowQRScanner(true),
    [],
  )

  const onQRRead = React.useCallback((qrText: string) => {
    validateAddress(qrText)
    hideQRScanner()
  }, [])

  /* set and validate */
  const handleChangeText = React.useCallback((text: string) => {
    setTo({ value: text, type: TYPES.NORMAL })
  }, [])

  const onBeforeChangeText = (address: string) => {
    console.log(address, isBitcoinAddressValid(address, token.bips[0]))
    onChangeText(address, isBitcoinAddressValid(address, token.bips[0]))
  }
  const onBlurValidate = () => validateAddress(to.value)

  const validateAddress = (text: string) => {
    // If domain, fetch it
    if (isDomain(text)) {
      rnsResolver
        .addr(text)
        .then((address: string) => {
          setTo({
            value: address,
            type: TYPES.DOMAIN,
            addressResolved: text,
          })
          // @todo implement bitcoin address validation
          // Set the address to valid === true
          onBeforeChangeText(address)
        })
        .catch((_e: any) => {})
    } /* default to normal validation */ else {
      onBeforeChangeText(text)
      setTo({
        value: text,
        type: TYPES.NORMAL,
        addressResolved: text,
      })
    }
  }

  const handlePasteClick = () =>
    Clipboard.getString().then((value: string) => {
      handleChangeText(value)
    })

  const onClearText = React.useCallback(() => handleChangeText(''), [])
  return (
    <>
      {shouldShowQRScanner && (
        <QRCodeScanner onClose={hideQRScanner} onCodeRead={onQRRead} />
      )}
      <View style={styles.inputContainer}>
        {to.type === TYPES.NORMAL && (
          <TextInput
            style={styles.input}
            onChangeText={handleChangeText}
            onBlur={onBlurValidate}
            autoCapitalize="none"
            autoCorrect={false}
            value={to.value}
            placeholder="address or rns domain"
            testID={'AddressBitcoinInput.Text'}
            editable={true}
            placeholderTextColor={colors.text.secondary}
          />
        )}
        {to.type === TYPES.DOMAIN && (
          <View style={styles.rnsDomainContainer}>
            <View>
              <Text style={styles.rnsDomainName}> {to.addressResolved}</Text>
              <Text style={styles.rnsDomainAddress}>{to.value}</Text>
            </View>
            <View style={styles.rnsDomainUnselect}>
              <TouchableOpacity onPress={() => {}}>
                <DeleteIcon color={'black'} width={20} height={20} />
              </TouchableOpacity>
            </View>
          </View>
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
              <Icon name="close-outline" style={styles.clearButton} size={15} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  )
}
