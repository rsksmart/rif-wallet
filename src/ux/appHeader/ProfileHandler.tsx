import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { RegularText } from '../../components'
import { AvatarIcon } from '../../components/icons/AvatarIcon'
import { IProfileStore } from '../../storage/ProfileStore'
import { colors } from '../../styles'

interface Props {
  navigation: any
  profile: IProfileStore
  profileCreated: boolean
}

export const ProfileHandler: React.FC<Props> = ({
  navigation,
  profile,
  profileCreated,
}) => {
  return (
    <TouchableOpacity
      style={styles.profileHandler}
      onPress={() =>
        navigation.navigate(
          profileCreated ? 'ProfileDetailsScreen' : 'ProfileCreateScreen',
          {
            navigation,
          },
        )
      }>
      {!profileCreated ? (
        <>
          <View style={styles.profileHandlerImage}>
            <MaterialIcon name="person" color="gray" size={20} />
          </View>
          <View style={styles.profileAddImage}>
            <MaterialIcon name="add" color="gray" size={15} />
          </View>
        </>
      ) : (
        <>
          <AvatarIcon
            value={profile.alias + '.rsk'}
            size={30}
            style={{ backgroundColor: 'white' }}
          />
          <View>
            {profile?.alias !== '' && (
              <RegularText style={styles.profileName}>
                {profile.alias}
              </RegularText>
            )}
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
