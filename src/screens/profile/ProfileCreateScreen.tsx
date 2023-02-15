import { useCallback, useState } from 'react'

import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { AvatarIcon } from 'components/icons/AvatarIcon'
import { MediumText } from 'components/index'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { TextInputWithLabel } from 'components/input/TextInputWithLabel'
import { RegularText } from 'components/typography' // TOOD: fix inconsistency of imports
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { selectProfile } from 'store/slices/profileSlice/selector'
import { deleteProfile, setProfile } from 'store/slices/profileSlice'
import { ProfileStore } from 'store/slices/profileSlice/types'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  profileStackRouteNames,
  ProfileStackScreenProps,
  ProfileStatus,
} from 'navigation/profileNavigator/types'

export const ProfileCreateScreen = ({
  route,
  navigation,
}: ProfileStackScreenProps<profileStackRouteNames.ProfileCreateScreen>) => {
  const editProfile = route.params?.editProfile
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const emptyProfile = {
    alias: '',
    email: '',
    phone: '',
    status: ProfileStatus.NONE,
  }
  const [localProfile, setLocalProfile] = useState<ProfileStore>(
    profile || emptyProfile,
  )
  const fullAlias = profile ? `${profile.alias}.rsk` : ''

  const createProfile = async () => {
    dispatch(setProfile({ ...localProfile, alias: profile?.alias || '' }))
    navigation.navigate(rootTabsRouteNames.Home)
  }

  const deleteAlias = async () => {
    dispatch(deleteProfile())
    navigation.navigate(rootTabsRouteNames.Home)
  }

  const onSetEmail = useCallback((email: string) => {
    setLocalProfile(prev => ({ ...prev, email }))
  }, [])

  const onSetPhone = useCallback((phone: string) => {
    setLocalProfile(prev => ({ ...prev, phone }))
  }, [])
  return (
    <KeyboardAvoidingView
      style={styles.screen}
      keyboardVerticalOffset={100}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={() => navigation.navigate(rootTabsRouteNames.Home)}
            accessibilityLabel="home">
            <View style={styles.backButton}>
              <MaterialIcon name="west" color="white" size={10} />
            </View>
          </TouchableOpacity>
          <MediumText style={styles.titleText}>
            {editProfile ? 'edit profile' : 'create profile'}
          </MediumText>
          {editProfile && (
            <TouchableOpacity onPress={deleteAlias} accessibilityLabel="delete">
              <MaterialIcon name="delete" color="white" size={20} />
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.bodyContainer}>
          <View style={styles.profileImageContainer}>
            {profile.status === ProfileStatus.USER ? (
              <AvatarIcon value={fullAlias} size={80} />
            ) : (
              <Image
                style={styles.profileImage}
                source={require('../../images/image_place_holder.jpeg')}
              />
            )}
          </View>
          <View>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              alias
            </MediumText>
          </View>
          {profile.status !== ProfileStatus.USER && (
            <>
              <View style={styles.rowContainer}>
                <PrimaryButton
                  onPress={() =>
                    navigation.navigate(profileStackRouteNames.SearchDomain)
                  }
                  accessibilityLabel="register new"
                  title={'register new'}
                />
              </View>
            </>
          )}

          {profile.status === ProfileStatus.USER && (
            <View style={styles.rowContainer}>
              <View style={styles.aliasContainer}>
                <View>
                  <RegularText style={styles.aliasText}>
                    {profile?.alias}
                  </RegularText>
                </View>
                <View>
                  <TouchableOpacity
                    accessibilityLabel="close"
                    onPress={() => deleteAlias()}>
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
              setValue={onSetPhone}
              placeholder="your phone number"
              keyboardType="phone-pad"
              optional={true}
            />
          </View>
          <View style={styles.rowContainer}>
            <TextInputWithLabel
              label="email"
              value={localProfile?.email}
              setValue={onSetEmail}
              placeholder="your email"
              optional={true}
            />
          </View>
          <View style={styles.rowContainer}>
            <PrimaryButton
              onPress={createProfile}
              accessibilityLabel="create"
              title={editProfile ? 'save' : 'create'}
              disabled={profile.status !== ProfileStatus.USER}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
  },
  bodyContainer: {
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
