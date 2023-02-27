import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import debounce from 'lodash.debounce'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import {
  AddressValidationMessage,
  validateAddress,
} from 'components/address/lib'
import { Input, MediumText } from 'components/index'
import { useFormContext } from 'react-hook-form'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { colors } from 'src/styles'
import addresses from './addresses.json'

interface Props {
  wallet: RIFWallet
  onDomainAvailable: (domain: string, valid: boolean) => void
  onDomainOwned: (owned: boolean) => void
}

enum DomainStatus {
  AVAILABLE = 'available',
  TAKEN = 'taken',
  NO_VALID = 'no valid',
  OWNED = 'owned',
  NONE = '',
}

export const DomainInput: React.FC<Props> = ({
  wallet,
  onDomainAvailable,
  onDomainOwned,
}: Props) => {
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [domainAvailability, setDomainAvailability] = useState<DomainStatus>(
    DomainStatus.NONE,
  )
  const { setValue } = useFormContext()
  const { t } = useTranslation()

  const rskRegistrar = useMemo(
    () =>
      new RSKRegistrar(
        addresses.rskOwnerAddress,
        addresses.fifsAddrRegistrarAddress,
        addresses.rifTokenAddress,
        wallet,
      ),
    [wallet],
  )
  const searchDomain = useCallback(
    async (domain: string) => {
      setError('')

      if (!/^[a-z0-9]+$/.test(domain)) {
        setError('Only lower cases and numbers are allowed')
        setDomainAvailability(DomainStatus.NO_VALID)
        onDomainAvailable(domain, false)
        return
      }

      if (domain.length < 5) {
        setDomainAvailability(DomainStatus.NONE)
        onDomainAvailable(domain, false)
        return
      }

      const available = await rskRegistrar.available(domain)

      if (!available) {
        const ownerAddress = await rskRegistrar.ownerOf(domain)
        const currentWallet = wallet.smartWallet.smartWalletAddress
        if (currentWallet === ownerAddress) {
          setDomainAvailability(DomainStatus.OWNED)
          onDomainOwned(true)
        } else {
          setDomainAvailability(DomainStatus.TAKEN)
        }
      } else {
        onDomainOwned(false)
        setDomainAvailability(DomainStatus.AVAILABLE)
        onDomainAvailable(domain, Boolean(available))
      }
    },
    [rskRegistrar, wallet, onDomainAvailable, onDomainOwned],
  )

  const doHandleChangeText = useCallback(
    async (inputText: string) => {
      if (!inputText) {
        setDomainAvailability(DomainStatus.NONE)
      } else {
        const newValidationMessage = validateAddress(inputText + '.rsk', -1)
        if (newValidationMessage === AddressValidationMessage.DOMAIN) {
          await searchDomain(inputText)
        } else {
          setDomainAvailability(DomainStatus.NONE)
        }
      }
    },
    [setDomainAvailability, searchDomain],
  )

  const handleChangeUsername = useMemo(
    () => debounce(doHandleChangeText, 300),
    [doHandleChangeText],
  )

  const getLabelColor = useMemo(() => {
    switch (domainAvailability) {
      case DomainStatus.AVAILABLE:
        return colors.green
      case DomainStatus.TAKEN:
        return colors.red
      case DomainStatus.OWNED:
        return colors.green
      case DomainStatus.NO_VALID:
        return sharedColors.subTitle
      default:
        return sharedColors.subTitle
    }
  }, [domainAvailability])

  const label = useMemo(() => {
    switch (domainAvailability) {
      case DomainStatus.AVAILABLE:
        return t('username_available')
      case DomainStatus.TAKEN:
        return t('username_unavailable')
      case DomainStatus.OWNED:
        return t('username_owned')
      case DomainStatus.NO_VALID:
        return t('username')
      default:
        return t('username')
    }
  }, [domainAvailability, t])

  const labelStyle = castStyle.text({
    color: getLabelColor,
  })

  useEffect(() => {
    onDomainAvailable(username, false)
    onDomainOwned(false)
    handleChangeUsername(username)
  }, [username, onDomainAvailable, onDomainOwned, handleChangeUsername])

  return (
    <>
      <Input
        accessibilityLabel={'Alias.Input'}
        inputName="domain"
        label={label}
        placeholder={t('username')}
        containerStyle={styles.domainContainer}
        labelStyle={labelStyle}
        inputStyle={styles.domainInput}
        placeholderStyle={styles.domainPlaceholder}
        resetValue={() => {
          setValue('domain', '')
          setDomainAvailability(DomainStatus.NONE)
        }}
        onChangeText={setUsername}
        suffix={<Text style={styles.domainSuffix}>.rsk</Text>}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View>
        {error && <MediumText style={styles.errorText}>{error}</MediumText>}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  domainContainer: castStyle.view({
    height: 80,
  }),
  domainInput: castStyle.text({
    paddingTop: 0,
    paddingLeft: 0,
    paddingBottom: 10,
  }),
  domainPlaceholder: castStyle.text({
    fontSize: 16,
    color: sharedColors.subTitle,
  }),
  domainSuffix: castStyle.text({
    paddingRight: 10,
    color: sharedColors.subTitle,
  }),
  errorText: castStyle.text({
    fontSize: 12,
    color: colors.red,
    paddingLeft: 5,
  }),
})
