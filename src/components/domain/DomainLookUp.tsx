import React, { useState } from 'react'
import { Text, TextInput, StyleSheet, View } from 'react-native'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { validateAddress, AddressValidationMessage } from '../address/lib'
import { colors } from '../../styles'
import addresses from '../../screens/rnsManager/addresses.json'

type DomainLookUpProps = {
  initialValue: string
  onChangeText: (newValue: string) => void
  domainAvailable: boolean
  wallet: any
  testID?: string
  backgroundColor?: string
  onDomainAvailable: any
}

export const DomainLookUp: React.FC<DomainLookUpProps> = ({
  initialValue,
  onChangeText,
  wallet,
  onDomainAvailable,
}) => {
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  useState<boolean>(false)
  // the address of the recipient
  const [recipient, setRecipient] = useState<string>(initialValue)
  const [info, setInfo] = useState('')
  const [error, setError] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('')
  const [selectedDomainAvailable, setSelectedDomainAvailable] =
    useState<boolean>(false)

  const [status, setStatus] = useState<{
    type: 'READY' | 'INFO' | 'ERROR' | 'CHECKSUM'
    value?: string
  }>({ type: 'READY' })

  const handleChangeText = async (inputText: string) => {
    console.log({ inputText })
    setStatus({ type: 'READY', value: '' })
    setRecipient(inputText)

    onChangeText(inputText)

    if (!inputText) {
      return
    }
    const newValidationMessage = validateAddress(inputText, -1)
    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      await searchDomain(inputText)
      setStatus({
        type: 'INFO',
        value: 'Getting address for domain...',
      })
    }
  }
  const searchDomain = async (domain: string) => {
    setSelectedDomain('')
    const domainName = domain.replace('.rsk', '')

    if (!/^[a-z0-9]*$/.test(domainName)) {
      console.log('Only lower cases and numbers are allowed')
      setError('Only lower cases and numbers are allowed')
      return
    }
    if (domainName.length < 5) {
      console.log('Only domains with 5 or more characters are allowed')
      setError('Only domains with 5 or more characters are allowed')
      return
    }
    setError('')

    const available = (await rskRegistrar.available(
      domainName,
    )) as any as boolean

    setSelectedDomainAvailable(available)

    if (available) {
      onDomainAvailable(domainName)
    }
  }

  return (
    <>
      <View style={styles.rowContainer}>
        <TextInput
          style={styles.input}
          onChangeText={handleChangeText}
          value={initialValue}
          placeholder="enter an alias name"
          keyboardType="numeric"
          accessibilityLabel={'Phone.Input'}
          placeholderTextColor={colors.gray}
        />
        {selectedDomainAvailable && (
          <View>
            <Text style={{ color: colors.green, right: 80, top: 19 }}>
              available
            </Text>
          </View>
        )}
        {!selectedDomainAvailable && (
          <View>
            <Text style={{ color: colors.red, right: 50, top: 19 }}>taken</Text>
          </View>
        )}
      </View>
      <View>
        {info !== '' && <Text style={{ color: colors.white }}>{info}</Text>}

        <View>
          {error !== '' && <Text style={{ color: colors.white }}>{error}</Text>}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    margin: 5,
    flexDirection: 'row',
  },
  input: {
    width: '100%',
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderRadius: 15,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 14,
    paddingRight: 100,
  },
})
