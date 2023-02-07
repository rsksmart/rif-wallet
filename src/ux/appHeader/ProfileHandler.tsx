import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import FA5Icon from 'react-native-vector-icons/FontAwesome5'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { useTranslation } from 'react-i18next'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { profileStackRouteNames } from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'
import { RegularText } from 'components/index'
import { colors } from 'src/styles'
import { Avatar } from 'src/components/avatar'

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
      {profile?.alias ? (
        <>
          {/* <AvatarIcon value={profile.alias + '.rsk'} size={30} /> */}
          <Avatar
            size={30}
            name={profile.alias + '.rsk'}
            // icon={<Icon name={'cat'} size={100} />}
            // imageSource={{
            //   uri: 'https://image.freepik.com/free-vector/cute-dog-head-avatar_79416-67.jpg',
            // }}
          />
          <View>
            <RegularText style={styles.profileName}>
              {profile.alias}
            </RegularText>
          </View>
        </>
      ) : (
        <>
          <View style={styles.profileHandlerImage}>
            <FA5Icon name="user-circle" color="white" size={15} />
          </View>
          <View style={{justifyContent:'center'}}>
            <Text style={[styles.profileName]} >{t('No username')}</Text>
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
    justifyContent: 'center'
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
})
