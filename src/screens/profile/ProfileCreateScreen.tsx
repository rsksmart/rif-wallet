import React, { useState } from 'react'
import { RegularText } from '../../components/typography'
import { IProfileStore } from '../../storage/ProfileStore'

import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'
import { MediumText } from '../../components'
import { PurpleButton } from '../../components/button/ButtonVariations'
import { TextInputWithLabel } from '../../components/input/TextInputWithLabel'
import { emptyProfile } from '../../core/hooks/useProfile'
import { ScreenProps } from '../../RootNavigation'
import { colors } from '../../styles'
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
        {editProfile && (
          <TouchableOpacity onPress={deleteAlias}>
            <MaterialIcon name="delete" color="white" size={20} />
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.container}>
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
          <TextInputWithLabel
            label="phone"
            value={localProfile?.phone}
            setValue={value =>
              setLocalProfile({
                ...localProfile,
                phone: value,
              })
            }
            placeholder="your phone number"
            keyboardType="phone-pad"
            optional={true}
          />
        </View>
        <View style={styles.rowContainer}>
          <TextInputWithLabel
            label="email"
            value={localProfile?.email}
            setValue={value =>
              setLocalProfile({
                ...localProfile,
                email: value,
              })
            }
            placeholder="your email"
            optional={true}
          />
        </View>
        <View style={styles.rowContainer}>
          <PurpleButton
            onPress={createProfile}
            accessibilityLabel="create"
            title={editProfile ? 'save' : 'create'}
            disabled={localProfile === emptyProfile}
          />
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.darkBlue,
  },
  titleText: {
    color: colors.lightPurple,
  },
  backButton: {
    color: colors.lightPurple,
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
  textLeftMargin: {
    marginLeft: 10,
  },
  masterText: {
    marginBottom: 0,
    color: colors.lightPurple,
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
    color: colors.lightPurple,
  },
})
