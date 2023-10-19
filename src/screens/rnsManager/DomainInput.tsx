import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'
import { FieldError } from 'react-hook-form'

import {
  AddressValidationMessage,
  validateAddress,
} from 'components/address/lib'
import { Input, Typography } from 'components/index'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { colors } from 'src/styles'
import { useAppSelector } from 'store/storeUtils'
import { selectChainId } from 'store/slices/settingsSlice'
import { RNS_ADDRESSES_BY_CHAIN_ID } from 'screens/rnsManager/types'

import { minDomainLength } from './SearchDomainScreen'

interface Props {
  wallet: RIFWallet
  inputName: string
  error: FieldError | undefined
  onDomainAvailable: (domain: string, valid: boolean) => void
  onDomainOwned: (owned: boolean) => void
  onResetValue: () => void
}

enum DomainStatus {
  AVAILABLE = 'available',
  TAKEN = 'taken',
  NO_VALID = 'no valid',
  OWNED = 'owned',
  NONE = '',
}

const labelColorMap = new Map([
  [DomainStatus.AVAILABLE, colors.green],
  [DomainStatus.TAKEN, colors.red],
  [DomainStatus.OWNED, colors.green],
  [DomainStatus.NO_VALID, sharedColors.subTitle],
  [DomainStatus.NONE, sharedColors.subTitle],
])

export const DomainInput = ({
  wallet,
  inputName,
  onDomainAvailable,
  onDomainOwned,
  onResetValue,
  error,
}: Props) => {
  const [username, setUsername] = useState<string>('')
  const [domainAvailability, setDomainAvailability] = useState<DomainStatus>(
    DomainStatus.NONE,
  )
  const chainId = useAppSelector(selectChainId)
  const { t } = useTranslation()
  const errorType = error?.type
  const errorMessage = error?.message

  const rskRegistrar = useMemo(
    () =>
      new RSKRegistrar(
        RNS_ADDRESSES_BY_CHAIN_ID[chainId].rskOwnerAddress,
        RNS_ADDRESSES_BY_CHAIN_ID[chainId].fifsAddrRegistrarAddress,
        RNS_ADDRESSES_BY_CHAIN_ID[chainId].rifTokenAddress,
        wallet,
      ),
    [wallet, chainId],
  )
  const searchDomain = useCallback(
    async (domain: string) => {
      if (errorType === 'matches' && errorMessage) {
        setDomainAvailability(DomainStatus.NO_VALID)
        onDomainAvailable(domain, false)
      } else if (errorType === 'min' && errorMessage) {
        setDomainAvailability(DomainStatus.NONE)
        onDomainAvailable(domain, false)
      } else {
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
      }
    },
    [
      errorType,
      errorMessage,
      onDomainAvailable,
      rskRegistrar,
      wallet.smartWallet.smartWalletAddress,
      onDomainOwned,
    ],
  )

  const onChangeText = useCallback(
    async (inputText: string) => {
      onDomainAvailable(inputText, false)
      onDomainOwned(false)
      setDomainAvailability(DomainStatus.NONE)
      if (inputText.length >= minDomainLength) {
        const newValidationMessage = validateAddress(inputText + '.rsk', -1)
        if (newValidationMessage === AddressValidationMessage.DOMAIN) {
          try {
            await searchDomain(inputText)
          } catch (err) {
            console.log('SEARCH DOMAIN ERR', err)
          }
        } else {
          setDomainAvailability(DomainStatus.NONE)
        }
      }
    },
    [setDomainAvailability, searchDomain, onDomainAvailable, onDomainOwned],
  )

  const handleChangeUsername = useMemo(
    () => debounce(onChangeText, 500),
    [onChangeText],
  )

  const resetField = () => {
    onResetValue()
    setDomainAvailability(DomainStatus.NONE)
    onDomainAvailable('', false)
    onDomainOwned(false)
    setUsername('')
  }

  useEffect(() => {
    handleChangeUsername(username)
  }, [error, username, handleChangeUsername])

  const labelTextMap = new Map([
    [DomainStatus.AVAILABLE, t('username_available')],
    [DomainStatus.TAKEN, t('username_unavailable')],
    [DomainStatus.OWNED, t('username_owned')],
    [DomainStatus.NO_VALID, t('username')],
    [DomainStatus.NONE, t('username')],
  ])

  const labelStyle = castStyle.text({
    color: labelColorMap.get(domainAvailability),
  })

  return (
    <>
      <Input
        accessibilityLabel={'Alias.Input'}
        inputName={inputName}
        label={labelTextMap.get(domainAvailability)}
        placeholder={t('username')}
        containerStyle={styles.domainContainer}
        labelStyle={labelStyle}
        placeholderStyle={styles.domainPlaceholder}
        resetValue={resetField}
        onChangeText={setUsername}
        suffix={<Text style={styles.domainSuffix}>.rsk</Text>}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {error && error.message && (
        <Typography
          type="body3"
          style={styles.errorText}
          accessibilityLabel="DomainInputErrorTypo">
          {error.message}
        </Typography>
      )}
    </>
  )
}

const styles = StyleSheet.create({
  domainContainer: castStyle.view({
    height: 80,
  }),
  domainPlaceholder: castStyle.text({
    fontSize: 14,
    color: sharedColors.subTitle,
  }),
  domainSuffix: castStyle.text({
    paddingRight: 10,
    color: sharedColors.subTitle,
  }),
  errorText: castStyle.text({
    color: colors.red,
    paddingLeft: 5,
  }),
})
