import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { RegularText } from '../../components'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import { IProfileStore } from '../../storage/MainStorage'
import { colors } from '../../styles'

import { useAliasRegistration } from '../../core/hooks/useAliasRegistration'
import { RIFWallet } from '../../lib/core'

interface Props {
  navigation: any
  profile: IProfileStore
  profileCreated: boolean
  wallet: RIFWallet
}

export const ProfileHandler: React.FC<Props> = ({
  navigation,
  profile,
  profileCreated,
  wallet,
}) => {
  const { registrationStarted, readyToRegister, getRegistrationData } =
    useAliasRegistration(wallet)
  const routeNextStep = async () => {
    if (await readyToRegister()) {
      const myAliasRegistration = await getRegistrationData()
      navigation.navigate('BuyDomain', {
        navigation,
        alias: myAliasRegistration?.alias,
        domainSecret: myAliasRegistration?.commitToRegisterSecret,
        duration: myAliasRegistration?.duration,
      })
    } else if (await registrationStarted()) {
      const myAliasRegistration = await getRegistrationData()
      navigation.navigate('RequestDomain', {
        navigation,
        alias: myAliasRegistration?.alias,
        duration: myAliasRegistration?.duration,
      })
    } else {
      navigation.navigate(
        profileCreated ? 'ProfileDetailsScreen' : 'ProfileCreateScreen',
        { navigation },
      )
    }
  }
  return (
    <TouchableOpacity style={styles.profileHandler} onPress={routeNextStep}>
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
