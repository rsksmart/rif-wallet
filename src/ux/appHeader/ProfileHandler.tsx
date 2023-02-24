import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import {
  profileStackRouteNames,
  ProfileStatus,
} from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'
import { Typography } from 'components/typography'
import { StepperComponent } from 'components/profile'
import { sharedColors } from 'shared/constants'
import { Avatar } from 'components/avatar'
import { castStyle } from 'shared/utils'

interface Props {
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
  const { t } = useTranslation()
  const profileCreated = profile.status === ProfileStatus.USER

  const getColors = useCallback(() => {
    switch (profile.status) {
      case ProfileStatus.REQUESTING:
        return {
          startColor: sharedColors.warning,
          endColor: sharedColors.inputActive,
        }
      case ProfileStatus.READY_TO_PURCHASE:
        return {
          startColor: sharedColors.success,
          endColor: sharedColors.inputActive,
        }
      case ProfileStatus.PURCHASING:
        return {
          startColor: sharedColors.success,
          endColor: sharedColors.warning,
        }
      case ProfileStatus.ERROR:
        return {
          startColor: sharedColors.danger,
          endColor: sharedColors.inputActive,
        }
    }
    return {
      startColor: sharedColors.inputActive,
      endColor: sharedColors.inputActive,
    }
  }, [profile.status])
  const { startColor, endColor } = getColors()
  const routeNextStep = async () => {
    navigation.navigate(rootTabsRouteNames.Profile, {
      screen: profileCreated
        ? profileStackRouteNames.ProfileDetailsScreen
        : profileStackRouteNames.ProfileCreateScreen,
      params: profileCreated ? { editProfile: false } : undefined,
    })
  }
  return (
    <TouchableOpacity
      style={styles.profileHandler}
      accessibilityLabel="profile"
      onPress={routeNextStep}>
      {profile.status === ProfileStatus.NONE && (
        <>
          <Avatar
            size={20}
            name={'person'}
            style={styles.profileHandlerImage}
            icon={
              <Icon
                name={'user-circle'}
                size={15}
                color={sharedColors.primary}
              />
            }
          />
          <View style={styles.textAlignment}>
            <Typography type={'h4'} style={[styles.profileName]}>
              {t('header_no_username')}
            </Typography>
          </View>
        </>
      )}
      {profile.status !== ProfileStatus.USER &&
        profile.status !== ProfileStatus.NONE && (
          <StepperComponent colors={[startColor, endColor]} />
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
          <Avatar size={30} name={profile.alias + '.rsk'} />
          <View style={styles.textAlignment}>
            <Typography type={'h4'} style={styles.profileName}>
              {profile.alias}
            </Typography>
          </View>
        </>
      )}

      {profile.status === ProfileStatus.ERROR && (
        <>
          <View style={styles.textAlignment}>
            <Typography type={'body3'} style={styles.requestingStatus}>
              {t('header_error')}
            </Typography>
          </View>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileHandler: castStyle.view({
    flexDirection: 'row',
  }),
  profileHandlerImage: castStyle.image({
    backgroundColor: sharedColors.white,
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
    textDecorationColor: sharedColors.white,
    textDecorationLine: 'underline',
    paddingLeft: 6,
  }),
})
