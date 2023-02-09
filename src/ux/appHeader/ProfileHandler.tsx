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
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { ProgressComponent } from 'components/profile/ProgressComponent'
import { sharedColors } from 'shared/constants'

interface Props {
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
  const { t } = useTranslation()
  const profileCreated = !!profile

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
      {(Object.keys(profile).length === 0 ||
        profile?.status === ProfileStatus.NONE) && (
        <>
          <View style={styles.textAlignment}>
            <Icon name="user-circle" color={sharedColors.white} size={15} />
          </View>
          <View style={styles.textAlignment}>
            <Typography type="h4" style={[styles.profileName]}>
              {t('No username')}
            </Typography>
          </View>
        </>
      )}
      {profile?.status === ProfileStatus.REQUESTING && (
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProfileStatus.REQUESTING}
          />
          <View style={styles.textAlignment}>
            <Typography type="body3" style={styles.requestingStatus}>
              {t('Requesting username')}
            </Typography>
          </View>
        </>
      )}

      {profile?.status === ProfileStatus.PURCHASE && (
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProfileStatus.PURCHASE}
          />
          <View style={styles.textAlignment}>
            <Typography type="body3" style={styles.underline}>
              {t('Purchase username')}
            </Typography>
          </View>
        </>
      )}

      {profile?.status === ProfileStatus.PURCHASING && (
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProfileStatus.PURCHASING}
          />
          <View style={styles.textAlignment}>
            <Typography type="body3" style={styles.requestingStatus}>
              {t('Purchasing username')}
            </Typography>
          </View>
        </>
      )}

      {profile?.status === ProfileStatus.USER && (
        <>
          <AvatarIcon value={profile.alias + '.rsk'} size={20} />
          <View style={styles.textAlignment}>
            <Typography type="h4" style={styles.profileName}>
              {profile.alias}
            </Typography>
          </View>
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  profileHandler: {
    display: 'flex',
    flexDirection: 'row',
  },
  profileAvatar: {
    height: 30,
    width: 30,
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
