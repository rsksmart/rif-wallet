import { useCallback, useState } from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import {
  rootStackRouteNames,
  RootStackScreenProps,
} from 'navigation/rootNavigator/types'
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'

import { AvatarIcon } from 'src/components/icons/AvatarIcon'
import { MediumText } from 'src/components'
import { PrimaryButton } from 'src/components/button/PrimaryButton'
import { TextInputWithLabel } from 'src/components/input/TextInputWithLabel'
import { colors } from 'src/styles'
import { fonts } from 'src/styles/fonts'
import { RegularText } from 'src/components/typography'
import { selectProfile } from 'src/redux/slices/profileSlice/selector'
import {
  deleteProfile,
  setProfile,
} from 'src/redux/slices/profileSlice/profileSlice'
import { IProfileStore } from 'src/redux/slices/profileSlice/types'
import { useAppDispatch, useAppSelector } from 'src/redux/storeUtils'

export const ProfileCreateScreen: React.FC<
  RootStackScreenProps<'ProfileCreateScreen'>
> = ({ route, navigation }) => {
  const editProfile = route.params?.editProfile
  const dispatch = useAppDispatch()
  const profile = useAppSelector(selectProfile)
  const emptyProfile = { alias: '', email: '', phone: '' }
  const [localProfile, setLocalProfile] = useState<IProfileStore>(
    profile || emptyProfile,
  )
  const fullAlias = profile ? `${profile.alias}.rsk` : ''

  const createProfile = async () => {
    dispatch(setProfile({ ...localProfile, alias: profile?.alias || '' }))
    navigation.navigate(rootStackRouteNames.Home)
  }

  const deleteAlias = async () => {
    dispatch(deleteProfile())
    navigation.navigate(rootStackRouteNames.Home)
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
            onPress={() => navigation.navigate(rootStackRouteNames.Home)}
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
            {profile?.alias ? (
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
          {!profile?.alias && (
            <>
              <View style={styles.rowContainer}>
                <PrimaryButton
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
                    accessibilityLabel="close"
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
              disabled={!profile}
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
