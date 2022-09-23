import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'

import { StyleSheet, View } from 'react-native'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import {
  validateAddress,
  AddressValidationMessage,
} from '../../components/address/lib'
import { colors } from '../../styles'
import addresses from './addresses.json'
import { MediumText } from '../../components/typography'

type DomainLookUpProps = {
  initialValue: string
  onChangeText: (newValue: string) => void
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
  const [error, setError] = useState('')
  const [domainAvailability, setDomainAvailability] = useState<
    'taken' | 'available' | 'no valid' | ''
  >('')

  const handleChangeText = async (inputText: string) => {
    onChangeText(inputText)

    if (!inputText) {
      return
    }
    const newValidationMessage = validateAddress(inputText, -1)
    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      await searchDomain(inputText)
    } else {
      setDomainAvailability('')
    }
  }
  const searchDomain = async (domain: string) => {
    const domainName = domain.replace('.rsk', '')

    if (!/^[a-z0-9]*$/.test(domainName)) {
      console.log('Only lower cases and numbers are allowed')
      setError('Only lower cases and numbers are allowed')
      setDomainAvailability('no valid')
      onDomainAvailable(domainName, false)
      return
    }
    if (domainName.length < 5) {
      console.log('Only domains with 5 or more characters are allowed')
      setError('Only domains with 5 or more characters are allowed')
      setDomainAvailability('no valid')
      onDomainAvailable(domainName, false)
      return
    }
    setError('')

    const available = (await rskRegistrar.available(
      domainName,
    )) as any as boolean

    setDomainAvailability(available ? 'available' : 'taken')
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
          accessibilityLabel={'Phone.Input'}
          placeholderTextColor={colors.gray}
          spellCheck={false}
          autoCapitalize="none"
        />
        {domainAvailability === 'available' && (
          <View>
            <MediumText style={styles.availableLabel}>
              {domainAvailability}
            </MediumText>
          </View>
        )}
        {(domainAvailability === 'taken' ||
          domainAvailability === 'no valid') && (
          <View>
            <MediumText style={styles.takenLabel}>
              {domainAvailability}
            </MediumText>
          </View>
        )}
      </View>
      <View>
        <View>
          {error !== '' && (
            <MediumText style={styles.infoLabel}>{error}</MediumText>
          )}
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  availableLabel: {
    color: colors.green,
    right: 80,
    top: 19,
  },
  takenLabel: {
    color: colors.red,
    right: 60,
    top: 19,
  },
  infoLabel: {
    color: colors.white,
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

export default DomainLookUp
