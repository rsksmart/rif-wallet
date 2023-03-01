import { RIFWallet } from '@rsksmart/rif-wallet-core'
import { RSKRegistrar } from '@rsksmart/rns-sdk'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text, View } from 'react-native'

import {
  AddressValidationMessage,
  validateAddress,
} from 'components/address/lib'
import { Input, Typography } from 'components/index'
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

const labelColorMap = new Map([
  [DomainStatus.AVAILABLE, colors.green],
  [DomainStatus.TAKEN, colors.red],
  [DomainStatus.OWNED, colors.green],
  [DomainStatus.NO_VALID, sharedColors.subTitle],
  [DomainStatus.NONE, sharedColors.subTitle],
])

export const DomainInput = ({
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

  const resetField = useCallback(() => {
    setValue('domain', '')
    setUsername('')
    setDomainAvailability(DomainStatus.NONE)
    onDomainAvailable('', false)
    onDomainOwned(false)
  }, [setValue, onDomainAvailable, onDomainOwned])

  const labelTextMap = useMemo(
    () =>
      new Map([
        [DomainStatus.AVAILABLE, t('username_available')],
        [DomainStatus.TAKEN, t('username_unavailable')],
        [DomainStatus.OWNED, t('username_owned')],
        [DomainStatus.NO_VALID, t('username')],
        [DomainStatus.NONE, t('username')],
      ]),
    [t],
  )

  const labelStyle = castStyle.text({
    color: labelColorMap.get(domainAvailability),
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
        label={labelTextMap.get(domainAvailability)}
        placeholder={t('username')}
        containerStyle={styles.domainContainer}
        labelStyle={labelStyle}
        inputStyle={styles.domainInput}
        placeholderStyle={styles.domainPlaceholder}
        resetValue={resetField}
        onChangeText={setUsername}
        suffix={<Text style={styles.domainSuffix}>.rsk</Text>}
        autoCapitalize="none"
        autoCorrect={false}
      />
      <View>
        {error && (
          <Typography type="body3" style={styles.errorText}>
            {error}
          </Typography>
        )}
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
    color: colors.red,
    paddingLeft: 5,
  }),
})
