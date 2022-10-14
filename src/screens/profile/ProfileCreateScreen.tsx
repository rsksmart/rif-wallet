import React, { useState } from 'react'
import { IProfileStore } from '../../storage/ProfileStore'
import { RegularText } from '../../components/typography'
import { TextInput } from 'react-native-gesture-handler'

import {
  KeyboardAvoidingView,
  Platform,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native'

import { colors } from '../../styles'
import { MediumText } from '../../components'
import { PurpleButton } from '../../components/button/ButtonVariations'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { ScreenProps } from '../../RootNavigation'
import { emptyProfile } from '../../core/hooks/useProfile'
import { fonts } from '../../styles/fonts'

export type CreateProfileScreenProps = {
  route: any
  profile: IProfileStore
  setProfile: (p: IProfileStore) => void
  storeProfile: (p: IProfileStore) => Promise<void>
  eraseProfile: () => Promise<void>
}
export const ProfileCreateScreen: React.FC<
  ScreenProps<'ProfileCreateScreen'> & CreateProfileScreenProps
> = ({ route, profile, setProfile, storeProfile, eraseProfile }) => {
  const navigation = route.params.navigation
  const editProfile = route.params.editProfile
  const [localProfile, setLocalProfile] = useState<IProfileStore>(profile)
  const createProfile = async () => {
    await storeProfile({ ...localProfile, alias: profile.alias })
    navigation.navigate('Home')
  }
  const deleteAlias = async () => {
    await eraseProfile()
    navigation.navigate('Home')
  }
  return (
    <>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
        <MediumText style={styles.titleText}>
          {editProfile ? 'edit profile' : 'create profile'}
        </MediumText>
        <TouchableOpacity onPress={() => deleteAlias()}>
          <MaterialIcon name="delete" color="white" size={20} />
        </TouchableOpacity>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
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
                onPress={() => navigation.navigate('SearchDomain')}
                accessibilityLabel="register new"
                title={'register new'}
              />
            </View>
          </>
        )}

        {!!profile?.alias && (
          <View style={styles.rowContainer}>
            <View style={styles.aliasContainer}>
              <View>
                <RegularText style={styles.aliasText}>
                  {profile?.alias}
                </RegularText>
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
            onChangeText={value =>
              setLocalProfile({
                ...localProfile,
                phone: value,
              })
            }
            value={localProfile?.phone}
            placeholder=""
            accessibilityLabel={'Phone.Input'}
            placeholderTextColor={colors.gray}
          />
        </View>
        <View style={styles.rowContainer}>
          <MediumText style={[styles.masterText, styles.textLeftMargin]}>
            email
          </MediumText>
          <TextInput
            style={styles.input}
            onChangeText={value =>
              setLocalProfile({
                ...localProfile,
                email: value,
              })
            }
            value={localProfile?.email}
            placeholder=""
            accessibilityLabel={'Email.Input'}
            placeholderTextColor={colors.gray}
          />
          <TextInput
            style={styles.input}
            onChangeText={value =>
              setLocalProfile({
                ...localProfile,
                email: value,
              })
            }
            value={localProfile?.email}
            placeholder=""
            accessibilityLabel={'Email.Input'}
            placeholderTextColor={colors.gray}
          />
        </View>
        <View style={styles.rowContainer}>
          <PurpleButton
            onPress={() => createProfile()}
            accessibilityLabel="create"
            title={editProfile ? 'save' : 'create'}
            disabled={localProfile === emptyProfile}
          />
        </View>
      </KeyboardAvoidingView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
    //backgroundColor: 'red',
  },
  titleText: {
    color: colors.white,
  },
  backButton: {
    color: colors.white,
    backgroundColor: colors.blue2,
    borderRadius: 20,
    padding: 10,
    bottom: 3,
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
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  textLeftMargin: {
    marginLeft: 10,
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
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  aliasText: {
    color: colors.white,
  },
})
