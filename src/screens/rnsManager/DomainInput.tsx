import { RIFWallet } from '@rsksmart/rif-wallet-core'
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
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import addresses from './addresses.json'

interface Props {
  wallet: RIFWallet
}

enum DomainStatus {
  AVAILABLE = 'available',
  TAKEN = 'taken',
  NO_VALID = 'no valid',
  OWNED = 'owned',
  NONE = '',
}

export const DomainInput: React.FC<Props> = ({ wallet }: Props) => {
  const { t } = useTranslation()
  const {
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext()
  const rskRegistrar = new RSKRegistrar(
    addresses.rskOwnerAddress,
    addresses.fifsAddrRegistrarAddress,
    addresses.rifTokenAddress,
    wallet,
  )
  const [domainAvailability, setDomainAvailability] = useState<DomainStatus>(
    DomainStatus.NONE,
  )
  const fieldError = errors.domain
  const error = errors.domain?.message || ''

  const domain = getValues('domain')

  const doHandleChangeText = async (inputText: string) => {
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
  }

  const searchDomain = async (domainName: string) => {
    // setError('')

    // if (!/^[a-z0-9]*$/.test(domainName)) {
    //   console.log('Only lower cases and numbers are allowed')
    //   setError('Only lower cases and numbers are allowed')
    //   setDomainAvailability(DomainStatus.NO_VALID)
    //   // onDomainAvailable(domainName, false)
    //   return
    // }

    // if (domainName.length < 5) {
    //   setDomainAvailability(DomainStatus.NONE)
    //   // onDomainAvailable(domainName, false)
    //   return
    // }

    if (fieldError?.type === 'min') {
      setDomainAvailability(DomainStatus.NONE)
      //   // onDomainAvailable(domainName, false)
      return
    }

    if (fieldError?.type === 'matches') {
      // console.log('Only lower cases and numbers are allowed')
      // setError('Only lower cases and numbers are allowed')
      setDomainAvailability(DomainStatus.NO_VALID)
      // onDomainAvailable(domainName, false)
      return
    }

    if (error) {
      // console.log(error)
      // setError(errorMessage as string)
      setDomainAvailability(DomainStatus.NO_VALID)
      // onDomainAvailable(domainName, false)
      return
    }

    const available = await rskRegistrar.available(domainName)

    if (!available) {
      const ownerAddress = await rskRegistrar.ownerOf(domainName)
      const currentWallet = wallet.smartWallet.smartWalletAddress
      if (currentWallet === ownerAddress) {
        setDomainAvailability(DomainStatus.OWNED)
        // onDomainOwned(true)
      } else {
        setDomainAvailability(DomainStatus.TAKEN)
      }
    } else {
      // onDomainOwned(false)
      setDomainAvailability(DomainStatus.AVAILABLE)
      // onDomainAvailable(domainName, Boolean(available))
    }
  }

  useEffect(() => {
    console.log('domain', domain)
  }, [domain])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleChangeText = useCallback(debounce(doHandleChangeText, 300), [])

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

  const labelStyle = castStyle.text({
    color: getLabelColor,
  })

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

  return (
    <>
      <Input
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
        onChangeText={handleChangeText}
        suffix={<Text style={styles.domainSuffix}>.rsk</Text>}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View>
        {error && <MediumText style={styles.errorLabel}>{error}</MediumText>}
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
  errorLabel: castStyle.text({
    color: colors.red,
    paddingLeft: 5,
  }),
})
