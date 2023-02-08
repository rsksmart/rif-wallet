import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import {
  profileStackRouteNames,
  ProgressBarStatus,
} from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'
import { RegularText } from 'components/index'
import { colors } from 'src/styles'
import { ProgressComponent } from './ProgressComponent'
import { AvatarIcon } from 'components/icons/AvatarIcon'

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
      {!profile?.requested && !profile?.processing && !profile?.purchased && (
        // No username
        <>
          <View style={styles.profileHandlerImage}>
            <FA5Icon name="user-circle" color="white" size={15} />
          </View>
          <View style={styles.textAlignment}>
            <Text style={[styles.profileName]}>{t('No username')}</Text>
          </View>
        </>
      )}
      {!profile?.requested && profile?.processing && !profile?.purchased && (
        //Requesting username
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProgressBarStatus.REQUESTING}
          />
          <View style={styles.textAlignment}>
            <Text style={[styles.requestingStatus, styles.textStatus]}>
              {t('Requesting username')}
            </Text>
          </View>
        </>
      )}

      {profile?.requested && !profile?.processing && !profile?.purchased && (
        //Purchase username
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProgressBarStatus.PURCHASE}
          />
          <View style={styles.textAlignment}>
            <Text style={[styles.textStatus, styles.underline]}>
              {t('Purchase username')}
            </Text>
          </View>
        </>
      )}

      {profile?.requested && profile?.processing && !profile?.purchased && (
        //Purchasing username
        <>
          <ProgressComponent
            width={18}
            height={7}
            status={ProgressBarStatus.PURCHASING}
          />
          <View style={styles.textAlignment}>
            <Text style={[styles.textStatus, styles.requestingStatus]}>
              {t('Purchasing username')}
            </Text>
          </View>
        </>
      )}

      {profile?.requested && !profile?.processing && profile?.purchased && (
        <>
          <AvatarIcon value={profile.alias + '.rsk'} size={20} />
          <View style={styles.textAlignment}>
            <RegularText style={styles.profileName}>
              {profile.alias}
            </RegularText>
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
  profileHandlerImage: {
    // backgroundColor: colors.lightGray,
    // padding: 5
    justifyContent: 'center',
  },
  profileAddImage: {
    backgroundColor: colors.darkPurple3,
    borderRadius: 20,
    height: 15,
    right: 8,
  },
  profileName: {
    lineHeight: 18,
    paddingLeft: 6,
    fontSize: 14,
    fontWeight: '500',
    color: colors.white,
  },
  textAlignment: {
    justifyContent: 'center',
  },
  textStatus: {
    fontSize: 14,
    color: colors.white,
    paddingLeft: 6,
  },
  requestingStatus: {
    opacity: 0.4,
  },
  underline: {
    textDecorationColor: colors.white,
    textDecorationLine: 'underline',
  },
})
