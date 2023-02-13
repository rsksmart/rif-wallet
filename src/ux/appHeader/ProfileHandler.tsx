import { StyleSheet, TouchableOpacity, View } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { profileStackRouteNames } from 'navigation/profileNavigator/types'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'
import { RegularText } from 'components/index'
import { colors } from 'src/styles'
import { Avatar } from 'src/components/avatar'
import { sharedColors } from 'src/shared/constants'

interface Props {
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
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
        <Avatar
          size={32}
          name={'person'}
          style={styles.profileHandlerImage}
          icon={
            <Icon name={'user-circle'} size={20} color={sharedColors.primary} />
          }
        />
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
  profileAddImage: {
    backgroundColor: colors.darkPurple3,
    borderRadius: 20,
    height: 15,
    right: 8,
  },
  profileName: {
    paddingTop: 5,
    paddingLeft: 5,
    color: colors.white,
  },
})
