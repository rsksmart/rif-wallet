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
import { MediumText, RegularText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { ProgressComponent } from './ProgressComponent'
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
      {profile?.status === ProfileStatus.NONE && (
        <>
          <View style={styles.textAlignment}>
            <Icon name="user-circle" color={sharedColors.white} size={15} />
          </View>
          <View style={styles.textAlignment}>
            <MediumText style={[styles.profileName]}>
              {t('No username')}
            </MediumText>
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
            <RegularText style={[styles.requestingStatus, styles.textStatus]}>
              {t('Requesting username')}
            </RegularText>
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
            <RegularText style={[styles.textStatus, styles.underline]}>
              {t('Purchase username')}
            </RegularText>
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
            <RegularText style={[styles.textStatus, styles.requestingStatus]}>
              {t('Purchasing username')}
            </RegularText>
          </View>
        </>
      )}

      {profile?.status === ProfileStatus.USER && (
        <>
          <AvatarIcon value={profile.alias + '.rsk'} size={20} />
          <View style={styles.textAlignment}>
            <MediumText style={styles.profileName}>{profile.alias}</MediumText>
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
    lineHeight: 18,
    paddingLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: sharedColors.white,
  },
  textAlignment: {
    justifyContent: 'center',
  },
  textStatus: {
    fontSize: 12,
    color: sharedColors.white,
    paddingLeft: 6,
  },
  requestingStatus: {
    opacity: 0.4,
  },
  underline: {
    textDecorationColor: sharedColors.white,
    textDecorationLine: 'underline',
  },
})
