import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { useProfileStatusColors } from 'lib/rns'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { StepperComponent } from 'components/profile'
import { Typography } from 'components/typography'
import { ProfileStatus } from 'navigation/profileNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors } from 'shared/constants'
import { sharedStyles } from 'shared/styles'
import { castStyle } from 'shared/utils'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'

interface Props {
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
  const { t } = useTranslation()
  const { startColor, endColor } = useProfileStatusColors()

  return (
    <TouchableOpacity
      style={styles.profileHandler}
      accessibilityLabel="profile"
      onPress={() => navigation.navigate(rootTabsRouteNames.Profile)}>
      {[ProfileStatus.NONE, ProfileStatus.WAITING_FOR_USER_COMMIT].includes(
        profile.status,
      ) && (
        <>
          <Icon
            name="person-circle-sharp"
            size={20}
            color={sharedColors.text.primary}
          />

          <View style={styles.textAlignment}>
            <Typography
              type="h4"
              style={styles.profileName}
              accessibilityLabel="noUsername">
              {t('header_no_username')}
            </Typography>
          </View>
        </>
      )}

      <View style={sharedStyles.row}>
        {![
          ProfileStatus.USER,
          ProfileStatus.WAITING_FOR_USER_COMMIT,
          ProfileStatus.NONE,
        ].includes(profile.status) && (
          <StepperComponent
            colors={[startColor, endColor]}
            style={styles.stepper}
          />
        )}

        {profile.status === ProfileStatus.REQUESTING && (
          <>
            <View style={styles.textAlignment}>
              <Typography type={'body3'} style={styles.requestingStatus}>
                {t('header_requesting')}
              </Typography>
            </View>
          </>
        )}

        {profile.status === ProfileStatus.READY_TO_PURCHASE && (
          <>
            <View style={styles.textAlignment}>
              <Typography type={'body3'} style={styles.underline}>
                {t('header_purchase')}
              </Typography>
            </View>
          </>
        )}

        {profile.status === ProfileStatus.PURCHASING && (
          <>
            <View style={styles.textAlignment}>
              <Typography type={'body3'} style={styles.requestingStatus}>
                {t('header_purchasing')}
              </Typography>
            </View>
          </>
        )}

        {profile.status === ProfileStatus.USER && (
          <>
            <AvatarIcon size={30} value={profile.alias} />
            <View style={styles.textAlignment}>
              <Typography type={'h4'} style={styles.profileName}>
                {profile.alias}
              </Typography>
            </View>
          </>
        )}

        {profile.status === ProfileStatus.REQUESTING_ERROR && (
          <>
            <View style={styles.textAlignment}>
              <Typography type={'body3'} style={styles.requestingStatus}>
                {t('header_error')}
              </Typography>
            </View>
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileHandler: castStyle.view({
    flexDirection: 'row',
  }),
  profileName: castStyle.text({
    paddingLeft: 6,
  }),
  textAlignment: castStyle.text({
    justifyContent: 'center',
  }),
  requestingStatus: castStyle.text({
    opacity: 0.4,
    paddingLeft: 6,
  }),
  underline: castStyle.text({
    textDecorationColor: sharedColors.text.primary,
    textDecorationLine: 'underline',
    paddingLeft: 6,
  }),
  stepper: castStyle.view({
    alignSelf: 'center',
  }),
})
