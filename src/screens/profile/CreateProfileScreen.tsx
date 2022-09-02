import React, { useState, useEffect } from 'react'
import {
  saveProfile,
  deleteProfile,
  IProfileStore,
} from '../../storage/ProfileStore'

import {
  View,
  StyleSheet,
  TextInput,
  Image,
  Text,
  TouchableOpacity,
} from 'react-native'
import { colors } from '../../styles'
import { MediumText } from '../../components'
import { PurpleButton } from '../../components/button/ButtonVariations'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ScreenProps } from '../../RootNavigation'

export type CreateProfileScreenProps = {
  route: any
  onAliasChange: any
}
export const CreateProfileScreen: React.FC<
  ScreenProps<'CreateProfileScreen'> & CreateProfileScreenProps
> = ({ route, onAliasChange }) => {
  const navigation = route.params.navigation
  const initialProfile: IProfileStore = route.params.profile
  const [profile, setProfile] = useState<IProfileStore>(initialProfile)
  useEffect(() => {
    setProfile(
      route.params.profile ?? {
        alias: '',
        phone: '',
        email: '',
      },
    )
  }, [route.params.profile])
  const createProfile = async () => {
    onAliasChange(profile)
    await saveProfile({
      alias: profile?.alias ?? '',
      phone: profile?.phone ?? '',
      email: profile?.email ?? '',
    })
    navigation.navigate('Home')
  }
  const deleteAlias = () => {
    deleteProfile()
    onAliasChange(undefined)
    navigation.navigate('Home')
  }
  return (
    <View style={styles.container}>
      <MediumText style={styles.titleText}>create profile</MediumText>
      <View style={styles.profileImageContainer}>
        <Image
          style={styles.profileImage}
          source={require('../../images/image_place_holder.jpeg')}
        />
      </View>
      <View>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          alias
        </MediumText>
      </View>
      {!profile?.alias && (
        <>
          <View style={styles.rowContainer}>
            <PurpleButton
              onPress={() => navigation.navigate('RNSManager')}
              accessibilityLabel="importWallet"
              title={'register new'}
            />
          </View>
          <View style={styles.rowContainer}>
            <PurpleButton
              onPress={() => deleteAlias()}
              accessibilityLabel="delete"
              title={'delete'}
            />
          </View>
        </>
      )}

      {profile?.alias !== '' && (
        <View style={styles.rowContainer}>
          <View style={styles.aliasContainer}>
            <View>
              <Text style={styles.aliasText}>{profile?.alias}</Text>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => setProfile({ ...profile, alias: '' })}>
                <MaterialIcon name="close" color={colors.white} size={20} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          phone
        </MediumText>

        <TextInput
          style={styles.input}
          onChangeText={value => setProfile({ ...profile, phone: value })}
          value={profile?.phone}
          placeholder=""
          keyboardType="numeric"
          testID={'Phone.Input'}
          placeholderTextColor={colors.gray}
        />
      </View>
      <View style={styles.rowContainer}>
        <MediumText style={[styles.masterText, styles.textLeftMargin]}>
          email
        </MediumText>
        <TextInput
          style={styles.input}
          onChangeText={value => setProfile({ ...profile, email: value })}
          value={profile?.email}
          placeholder=""
          keyboardType="numeric"
          testID={'Email.Input'}
          placeholderTextColor={colors.gray}
        />
      </View>
      <View style={styles.rowContainer}>
        <PurpleButton
          onPress={() => createProfile()}
          accessibilityLabel="create"
          title={'create'}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
  },
  input: {
    borderColor: colors.white,
    borderWidth: 1,
    borderRadius: 100,
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 14,
  },
  textLeftMargin: {
    marginLeft: 10,
  },
  titleText: {
    alignSelf: 'center',
    marginBottom: 12,
    color: colors.white,
  },
  masterText: {
    marginBottom: 0,
    color: colors.white,
  },
  rowContainer: {
    margin: 5,
  },
  buttonFirstStyle: {
    width: undefined,
    marginHorizontal: undefined,
    marginBottom: 20,
    backgroundColor: colors.blue,
  },
  aliasContainer: {
    backgroundColor: colors.darkPurple5,
    padding: 17,
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aliasText: {
    color: colors.white,
  },
})
