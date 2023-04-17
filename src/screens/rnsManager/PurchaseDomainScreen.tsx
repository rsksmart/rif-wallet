import { useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import {
  DomainRegistrationEnum,
  RnsProcessor,
  useRifToken,
  useRnsDomainPriceInRif as calculatePrice,
} from 'lib/rns'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { AppButton, Input, Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { purchaseUsername, selectProfile } from 'store/slices/profileSlice'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { ScreenWithWallet } from 'screens/types'

import { rnsManagerStyles } from './rnsManagerStyles'

type Props = ProfileStackScreenProps<profileStackRouteNames.PurchaseDomain>

export const PurchaseDomainScreen = ({
  navigation,
  wallet,
}: Props & ScreenWithWallet) => {
  const dispatch = useAppDispatch()
  const rifToken = useRifToken()
  const profile = useAppSelector(selectProfile)
  const alias = profile.alias
  const duration = profile.duration || 1

  const rnsProcessor = useMemo(() => new RnsProcessor({ wallet }), [wallet])

  const methods = useForm()
  const { t } = useTranslation()
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<number>(2)

  const selectedDomainPriceInUsd = (
    rifToken.price * selectedDomainPrice
  ).toFixed(2)

  useEffect(() => {
    calculatePrice(alias, duration).then(setSelectedDomainPrice)
  }, [alias, duration])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  const registerDomain = async () => {
    const domain = alias.split('.')[0]
    try {
      const response = await dispatch(
        purchaseUsername({ rnsProcessor, domain }),
      ).unwrap()
      if (response === DomainRegistrationEnum.REGISTERING_REQUESTED) {
        navigation.navigate(profileStackRouteNames.AliasBought, {
          alias: alias,
        })
      }
    } catch (e) {
      // @todo error handling
    }
  }

  return (
    <ScrollView style={rnsManagerStyles.scrollContainer}>
      <View style={rnsManagerStyles.container}>
        <Typography
          type="h2"
          style={[rnsManagerStyles.subtitle, rnsManagerStyles.marginBottom]}>
          {t('header_purchase')}
        </Typography>
        <View style={rnsManagerStyles.profileImageContainer}>
          <AvatarIcon value={alias} size={100} />

          <Typography type="h3" style={rnsManagerStyles.profileDisplayAlias}>
            {alias}
          </Typography>
        </View>
        <FormProvider {...methods}>
          <Input
            inputName="duration"
            label={t('purchase_username_duration_label')}
            placeholder={`${duration} ${t('request_username_placeholder')}${
              duration > 1 ? 's' : ''
            }`}
            isReadOnly
          />

          <Input
            inputName="price"
            label={t('purchase_username_price_label')}
            placeholder={`${selectedDomainPrice} ${rifToken?.symbol}`}
            subtitle={`$ ${selectedDomainPriceInUsd}`}
            containerStyle={styles.priceContainer}
            isReadOnly
          />
        </FormProvider>
        <AppButton
          style={rnsManagerStyles.button}
          onPress={registerDomain}
          accessibilityLabel={t('purchase_username_button')}
          title={t('purchase_username_button')}
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    justifyContent: 'space-between',
  }),
  priceContainer: castStyle.view({
    height: 90,
  }),
})
