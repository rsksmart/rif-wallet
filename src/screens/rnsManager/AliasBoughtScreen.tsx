import { useEffect } from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { AppButton, Typography } from 'components/index'
import { setProfile } from 'store/slices/profileSlice'
import { useAppDispatch } from 'store/storeUtils'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { castStyle } from 'shared/utils'
import { AppSpinner } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'

export const AliasBoughtScreen = ({
  navigation,
  route,
}: ProfileStackScreenProps<profileStackRouteNames.AliasBought>) => {
  const { t } = useTranslation()
  const { alias } = route.params

  const dispatch = useAppDispatch()

  const onCloseButtonPressed = () => {
    navigation.navigate(profileStackRouteNames.ProfileCreateScreen)
  }

  useEffect(() => {
    dispatch(
      setProfile({
        phone: '',
        email: '',
        alias: `${alias}`,
        status: ProfileStatus.USER,
        infoBoxClosed: true,
        duration: null,
      }),
    )
  }, [alias, dispatch])

  return (
    <ScrollView contentContainerStyle={[sharedStyles.flex, styles.container]}>
      <View style={styles.spinner}>
        <AppSpinner size={190} />
      </View>
      <View style={styles.textContainer}>
        <Typography type="h3" accessibilityLabel={'congratulation'}>
          {t('alias_bought_congratulations')}
        </Typography>
        <Typography type="h4" style={styles.secondTypographyStyle}>
          {t('alias_bought_you_requested_domain')}
        </Typography>
        <Typography type="h5">
          {t('alias_bought_transaction_processing')}
        </Typography>
      </View>
      <AppButton
        title={t('alias_bought_close_button')}
        color={sharedColors.button.primaryBackground}
        textColor={sharedColors.button.primaryText}
        onPress={onCloseButtonPressed}
        accessibilityLabel={'close'}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    backgroundColor: sharedColors.primary,
    paddingHorizontal: 22.35,
  }),
  spinner: castStyle.view({
    flexBasis: '50%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  }),
  textContainer: castStyle.view({
    flexBasis: '40%',
    alignItems: 'center',
    justifyContent: 'center',
  }),
  secondTypographyStyle: castStyle.text({
    marginTop: 9.05,
    marginBottom: 30.84,
  }),
})
