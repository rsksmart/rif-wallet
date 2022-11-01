import React, { useState } from 'react'

import { RSKRegistrar } from '@rsksmart/rns-sdk'
import { StyleSheet, View } from 'react-native'
import {
  AddressValidationMessage,
  validateAddress,
} from '../../components/address/lib'
import { TextInputWithLabel } from '../../components/input/TextInputWithLabel'
import { BaseInputStatus } from '../../components/shared'
import { MediumText } from '../../components/typography'
import { colors } from '../../styles'
import addresses from './addresses.json'

interface DomainLookUpProps {
  initialValue: string
  onChangeText: (newValue: string) => void
  wallet: any
  onDomainAvailable: any
}

enum DomainStatus {
  AVAILABLE,
  TAKEN,
  NO_VALID,
  NONE,
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
  const [domainAvailability, setDomainAvailability] = useState<DomainStatus>(
    DomainStatus.NONE,
  )

  const handleChangeText = async (inputText: string) => {
    onChangeText(inputText)

    if (!inputText) {
      return
    }
    const newValidationMessage = validateAddress(inputText + '.rsk', -1)
    if (newValidationMessage === AddressValidationMessage.DOMAIN) {
      await searchDomain(inputText)
    } else {
      setDomainAvailability(DomainStatus.NONE)
    }
  }
  const searchDomain = async (domain: string) => {
    const domainName = domain.replace('.rsk', '')
    setError('')

    if (!/^[a-z0-9]*$/.test(domainName)) {
      console.log('Only lower cases and numbers are allowed')
      setError('Only lower cases and numbers are allowed')
      setDomainAvailability(DomainStatus.NO_VALID)
      onDomainAvailable(domainName, false)
      return
    }

    if (domainName.length < 5) {
      setDomainAvailability(DomainStatus.NONE)
      return
    }

    const available = (await rskRegistrar.available(
      domainName,
    )) as any as boolean

    setDomainAvailability(
      available ? DomainStatus.AVAILABLE : DomainStatus.TAKEN,
    )
    if (available) {
      onDomainAvailable(domainName)
    }
  }

  const getStatus = (domainAvailability: DomainStatus) => {
    switch (domainAvailability) {
      case DomainStatus.AVAILABLE:
        return BaseInputStatus.VALID
      case DomainStatus.TAKEN:
        return BaseInputStatus.INVALID
      default:
        return BaseInputStatus.NEUTRAL
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
        {domainAvailability === DomainStatus.AVAILABLE && (
          <MediumText style={styles.availableLabel}>
            {domainAvailability}
          </MediumText>
        )}
        {(domainAvailability === DomainStatus.TAKEN ||
          domainAvailability === DomainStatus.NO_VALID) && (
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
