import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { navigationContainerRef } from 'src/core/Core'
import { rootStackRouteNames } from 'src/navigation/rootNavigator'
import { selectProfile } from 'src/redux/slices/profileSlice/selector'
import { useAppSelector } from 'src/redux/storeUtils'
import { RegularText } from '../../components'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import { colors } from '../../styles'


export const ProfileHandler = () => {
  const profile = useAppSelector(selectProfile)
  const profileCreated = !!profile
  return (
    <TouchableOpacity
      style={styles.profileHandler}
      accessibilityLabel="profile"
      onPress={() =>
        navigationContainerRef.navigate(
          profileCreated
            ? rootStackRouteNames.ProfileDetailsScreen
            : rootStackRouteNames.ProfileCreateScreen,
          { editProfile: profileCreated },
        )
      }>
      {profile?.alias ? (
        <>
          <AvatarIcon value={profile.alias + '.rsk'} size={30} />
          <View>
            <RegularText style={styles.profileName}>
              {profile.alias}
            </RegularText>
          </View>
        </>
      ) : (
        <>
          <View style={styles.profileHandlerImage}>
            <MaterialIcon name="person" color="gray" size={20} />
          </View>
          <View style={styles.profileAddImage}>
            <MaterialIcon name="add" color="gray" size={15} />
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
    backgroundColor: colors.lightGray,
    borderRadius: 15,
    padding: 5,
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
