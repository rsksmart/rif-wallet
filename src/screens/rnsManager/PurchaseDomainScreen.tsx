import { useCallback, useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { AppButton, Input, Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { selectBalances } from 'src/redux/slices/balancesSlice'
import { selectUsdPrices } from 'src/redux/slices/usdPricesSlice'
import { selectProfile } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

import { rnsManagerStyles } from './rnsManagerStyles'

type Props = ProfileStackScreenProps<profileStackRouteNames.PurchaseDomain>

export const PurchaseDomainScreen = ({ navigation }: Props) => {
  const { alias, duration = 1 } = useAppSelector(selectProfile)
  const tokenBalances = useAppSelector(selectBalances)
  const prices = useAppSelector(selectUsdPrices)

  const methods = useForm()
  const { t } = useTranslation()
  const [selectedDomainPrice, setSelectedDomainPrice] = useState<number>(2)

  // calculate price of domain in USD
  const rifToken = Object.values(tokenBalances).find(
    token => token.symbol === 'RIF' || token.symbol === 'tRIF',
  )
  const rifTokenAddress = rifToken?.contractAddress || ''
  const rifTokenPrice = prices[rifTokenAddress]?.price
  const selectedDomainPriceInUsd = (
    rifTokenPrice * selectedDomainPrice
  ).toFixed(2)

  // TODO: move this to a hook
  const calculatePrice = useCallback(async (_: string, years: number) => {
    //TODO: re enable this later
    /*const price = await rskRegistrar.price(domain, BigNumber.from(years))
    return utils.formatUnits(price, 18)*/
    if (years < 3) {
      return years * 2
    } else {
      return 4 + (years - 2)
    }
  }, [])

  useEffect(() => {
    calculatePrice(alias, duration).then(setSelectedDomainPrice)
  }, [alias, duration, calculatePrice])

  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(onBackPress),
    })
  }, [navigation, onBackPress])

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
          onPress={() => console.log('purchase username')}
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
  container: {
    justifyContent: 'space-between',
  },
  priceContainer: castStyle.view({
    height: 90,
  }),
})
