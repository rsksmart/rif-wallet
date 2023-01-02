import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'

import { RIFWallet } from 'lib/core'

import { rootTabsRouteNames } from 'src/navigation/rootNavigator'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { useAppSelector } from 'store/storeUtils'
import { RegularText } from 'components/index'
import { AvatarIcon } from 'components/icons/AvatarIcon'
import { colors } from 'src/styles'
import { useAliasRegistration } from 'core/hooks/useAliasRegistration'
import { profileStackRouteNames } from 'src/navigation/profileNavigator/types'

interface Props {
  wallet: RIFWallet
  navigation: BottomTabHeaderProps['navigation']
}

export const ProfileHandler = ({ wallet, navigation }: Props) => {
  const profile = useAppSelector(selectProfile)
  const profileCreated = !!profile

  const { registrationStarted, readyToRegister, getRegistrationData } =
    useAliasRegistration(wallet)

  const routeNextStep = async () => {
    if (await readyToRegister()) {
      const myAliasRegistration = await getRegistrationData()
      navigation.navigate(rootTabsRouteNames.Profile, {
        screen: profileStackRouteNames.BuyDomain,
        params: {
          alias: myAliasRegistration?.alias,
          domainSecret: myAliasRegistration?.commitToRegisterSecret,
          duration: myAliasRegistration?.duration,
        },
      })
    } else if (await registrationStarted()) {
      const myAliasRegistration = await getRegistrationData()
      navigation.navigate(rootTabsRouteNames.Profile, {
        screen: profileStackRouteNames.RequestDomain,
        params: {
          alias: myAliasRegistration?.alias,
          duration: myAliasRegistration?.duration,
        },
      })
    } else {
      navigation.navigate(rootTabsRouteNames.Profile, {
        screen: profileCreated
          ? profileStackRouteNames.ProfileDetailsScreen
          : profileStackRouteNames.ProfileCreateScreen,
        params: profileCreated ? { editProfile: false } : undefined,
      })
    }
  }
  return (
    <TouchableOpacity
      style={styles.profileHandler}
      accessibilityLabel="profile"
      onPress={routeNextStep}>
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
