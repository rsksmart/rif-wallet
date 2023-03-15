import { useCallback, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { AppButton, Input, Typography } from 'components/index'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
} from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'
import { castStyle } from 'shared/utils'
import { sharedColors, sharedStyles } from 'shared/constants'

import { rnsManagerStyles } from './rnsManagerStyles'

type Props = ProfileStackScreenProps<profileStackRouteNames.PurchaseDomain>

export const PurchaseDomainScreen = ({ navigation }: Props) => {
  const { alias } = useAppSelector(selectProfile)
  const methods = useForm()
  const { t } = useTranslation()

  const onBackPress = useCallback(() => navigation.goBack(), [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(onBackPress),
    })
  }, [navigation, onBackPress])

  return (
    <View style={[rnsManagerStyles.container, styles.container]}>
      <View style={sharedStyles.flex}>
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
            placeholder={'1 year'}
            isReadOnly
          />

          <Input
            inputName="price"
            label={t('purchase_username_price_label')}
            placeholder={'4 tRIF'}
            subtitle={'$0.40'}
            containerStyle={styles.priceContainer}
            isReadOnly
          />
        </FormProvider>
      </View>
      <View style={rnsManagerStyles.bottomContainer}>
        <AppButton
          onPress={() => console.log('purchase username')}
          accessibilityLabel={t('purchase_username_button')}
          title={t('purchase_username_button')}
          color={sharedColors.white}
          textColor={sharedColors.black}
        />
      </View>
    </View>
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
