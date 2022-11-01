import React, { useState } from 'react'

import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { StyleSheet, View } from 'react-native'
import {
  AddressValidationMessage,
  validateAddress,
} from '../../components/address/lib'
import { TextInputWithLabel } from '../../components/input/TextInputWithLabel'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'
import addresses from './addresses.json'

interface DomainLookUpProps {
  initialValue: string
  onChangeText: (newValue: string) => void
  wallet: any
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

  const getStatus = (domainAvailability: string) => {
    switch (domainAvailability) {
      case 'available':
        return 'valid'
      case 'taken':
        return 'invalid'
      default:
        return 'neutral'
    }
  }

  const status = getStatus(domainAvailability)

  return (
    <>
      <View>
        <TextInputWithLabel
          label="username"
          value={initialValue}
          setValue={handleChangeText}
          placeholder="enter an alias name"
          accessibilityLabel={'Alias.Input'}
          suffix=".rsk"
          status={status}
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
  availableLabel: {
    color: colors.green,
    paddingLeft: 5,
  },
  takenLabel: {
    color: colors.red,
    paddingLeft: 5,
  },
  infoLabel: {
    color: colors.lightPurple,
    paddingLeft: 5,
  },
})

export default DomainLookUp
