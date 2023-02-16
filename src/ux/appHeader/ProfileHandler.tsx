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

interface Props {
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
  const { t } = useTranslation()
  const profileCreated = profile.status === ProfileStatus.USER

  const getColors = useCallback((status: ProfileStatus) => {
    switch (status) {
      case ProfileStatus.REQUESTING:
        return {
          start: sharedColors.warning,
          end: sharedColors.inputActive,
        }
      case ProfileStatus.READY_TO_PURCHASE:
        return {
          start: sharedColors.success,
          end: sharedColors.inputActive,
        }
      case ProfileStatus.PURCHASING:
        return { start: sharedColors.success, end: sharedColors.warning }
      case ProfileStatus.ERROR:
        return { start: sharedColors.danger, end: sharedColors.inputActive }
    }
    return {
      start: sharedColors.inputActive,
      end: sharedColors.inputActive,
    }
  }, [])
  const { start, end } = getColors(profile.status)

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
              {t('No username')}
            </Typography>
          </View>
        </>
      )}
      {profile.status === ProfileStatus.REQUESTING && (
        <>
          <StepperComponent start={start} end={end} />
          <View style={styles.textAlignment}>
            <Typography type={'body3'} style={styles.requestingStatus}>
              {t('Requesting username')}
            </Typography>
          </View>
        </>
      )}

      {profile.status === ProfileStatus.READY_TO_PURCHASE && (
        <>
          <StepperComponent start={start} end={end} />
          <View style={styles.textAlignment}>
            <Typography type={'body3'} style={styles.underline}>
              {t('Purchase username')}
            </Typography>
          </View>
        </>
      )}

      {profile.status === ProfileStatus.PURCHASING && (
        <>
          <StepperComponent start={start} end={end} />
          <View style={styles.textAlignment}>
            <Typography type={'body3'} style={styles.requestingStatus}>
              {t('Purchasing username')}
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
          <StepperComponent start={start} end={end} />
          <View style={styles.textAlignment}>
            <Typography type={'body3'} style={styles.requestingStatus}>
              {t('Error Requesting username')}
            </Typography>
          </View>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileHandler: {
    flexDirection: 'row',
  },
  profileAvatar: {
    height: 30,
    width: 30,
  },
  profileHandlerImage: {
    backgroundColor: sharedColors.white,
  },
  profileName: {
    paddingLeft: 6,
  },
  textAlignment: {
    justifyContent: 'center',
  },
  requestingStatus: {
    opacity: 0.4,
    paddingLeft: 6,
  },
  underline: {
    textDecorationColor: sharedColors.white,
    textDecorationLine: 'underline',
    paddingLeft: 6,
  },
})
