import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import { colors } from '../../styles'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { IProfileStore } from '../../storage/ProfileStore'

type Props = {
  navigation: any
  profile: IProfileStore | undefined
}

export const ProfileHandler: React.FC<Props> = ({ navigation, profile }) => {
  return (
    <TouchableOpacity
      style={styles.profileHandler}
      onPress={() =>
        navigation.navigate('CreateProfileScreen', {
          navigation,
          profile: profile,
        })
      }>
      {!profile && (
        <>
          <View style={styles.profileHandlerImage}>
            <MaterialIcon name="person" color="gray" size={20} />
          </View>
          <View style={styles.profileAddImage}>
            <MaterialIcon name="add" color="gray" size={15} />
          </View>
        </>
      )}
      {profile && (
        <>
          <Image
            style={styles.profileAvatar}
            source={require('../../images/avataaars.png')}
          />
          <View>
            {profile?.alias !== '' && (
              <Text style={styles.profileName}>{profile.alias}</Text>
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
