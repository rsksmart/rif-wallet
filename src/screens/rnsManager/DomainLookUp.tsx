import React, { useState } from 'react'
import { TextInput } from 'react-native-gesture-handler'

import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { StyleSheet, View } from 'react-native'
import {
  AddressValidationMessage,
  validateAddress,
} from '../../components/address/lib'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'
import addresses from './addresses.json'

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
    const newValidationMessage = validateAddress(inputText + '.rsk', -1)
    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      await searchDomain(inputText)
    } else {
      setDomainAvailability('')
    }
  }
  const searchDomain = async (domain: string) => {
    const domainName = domain.replace('.rsk', '')
    setError('')

    if (!/^[a-z0-9]*$/.test(domainName)) {
      console.log('Only lower cases and numbers are allowed')
      setError('Only lower cases and numbers are allowed')
      setDomainAvailability('no valid')
      onDomainAvailable(domainName, false)
      return
    }

    if (domainName.length < 5) {
      setDomainAvailability('')
      return
    }

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
          accessibilityLabel={'Alias.Input'}
          placeholderTextColor={colors.gray}
          spellCheck={false}
          autoCapitalize="none"
        />
        {domainAvailability === 'available' && (
          <MediumText style={styles.availableLabel}>
            {domainAvailability}
          </MediumText>
        )}
        {(domainAvailability === 'taken' ||
          domainAvailability === 'no valid') && (
          <MediumText style={styles.takenLabel}>
            {domainAvailability}
          </MediumText>
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
    backgroundColor: colors.background.secondary,
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    width: '100%',
    color: colors.lightPurple,
    fontSize: 16,
    fontWeight: 'bold',
  },
  availableLabel: {
    color: colors.green,
  },
  takenLabel: {
    color: colors.red,
  },
  infoLabel: {
    color: colors.lightPurple,
  },
})

export default DomainLookUp
