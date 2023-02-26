import { RIFWallet } from '@rsksmart/rif-wallet-core'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Text } from 'react-native'

import { Input } from 'components/index'
import { useFormContext } from 'react-hook-form'
import { sharedColors } from 'src/shared/constants'
import { castStyle } from 'src/shared/utils'

interface Props {
  wallet: RIFWallet
}

export const DomainInput: React.FC<Props> = ({ wallet }: Props) => {
  const { t } = useTranslation()
  const { register, setValue } = useFormContext()

  return (
    <Input
      inputName="domain"
      label={t('username')}
      placeholder={t('username')}
      containerStyle={styles.domainContainer}
      labelStyle={styles.domainLabel}
      inputStyle={styles.domainInput}
      placeholderStyle={styles.domainPlaceholder}
      resetValue={() => setValue('domain', '')}
      suffix={<Text style={styles.domainSuffix}>.rsk</Text>}
      autoCapitalize="none"
      autoCorrect={false}
      {...register('domain')}
    />
  )
}

const styles = StyleSheet.create({
  domainContainer: castStyle.view({
    height: 80,
  }),
  domainLabel: castStyle.text({}),
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
})
