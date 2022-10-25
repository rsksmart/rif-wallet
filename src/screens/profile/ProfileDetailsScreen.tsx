import React from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import Clipboard from '@react-native-community/clipboard'

import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { ScreenProps } from '../../RootNavigation'
import { MediumText } from '../../components'
import { IProfileStore } from '../../storage/ProfileStore'
import { AvatarIcon } from '../../components/icons/AvatarIcon'

export type ProfileDetailsScreenProps = {
  route: any
  navigation: any
  profile: IProfileStore
}
export const ProfileDetailsScreen: React.FC<
  ScreenProps<'ProfileDetailsScreen'> & ProfileDetailsScreenProps
> = ({ navigation, profile }) => {
  const fullAlias = `${profile.alias}.rsk`
  return (
    <View style={styles.staticBackground}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <View style={styles.backButton}>
            <MaterialIcon name="west" color="white" size={10} />
          </View>
        </TouchableOpacity>
        <MediumText style={styles.titleText}>profile</MediumText>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ProfileCreateScreen', {
              navigation,
              editProfile: true,
            })
          }>
          <MaterialIcon name="edit" color="white" size={20} />
        </TouchableOpacity>
      </View>
      <View style={styles.roundedContainer}>
        <View style={styles.topContainer}>
          <View style={styles.profileImageContainer}>
            <AvatarIcon value={fullAlias} size={80} />
          </View>
          <View>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              alias
            </MediumText>
          </View>

          <View style={styles.rowContainer}>
            <View style={styles.fieldContainer}>
              <MediumText style={[styles.masterText, styles.textLeftMargin]}>
                {profile?.alias}
              </MediumText>
              <TouchableOpacity
                onPress={() => Clipboard.setString(profile?.alias || '')}>
                <MaterialIcon
                  style={styles.copyIcon}
                  name="content-copy"
                  color="white"
                  size={18}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.container}>
        <View>
          <MediumText style={[styles.masterText, styles.textLeftMargin]}>
            phone
          </MediumText>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              {profile?.phone}
            </MediumText>
          </View>
        </View>

        <View>
          <MediumText style={[styles.masterText, styles.textLeftMargin]}>
            email
          </MediumText>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              {profile?.email}
            </MediumText>
          </View>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  staticBackground: {
    height: '100%',
    width: '100%',
    backgroundColor: colors.background.darkBlue,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background.darkBlue,
    paddingTop: 10,
    paddingHorizontal: 40,
  },
  topContainer: {
    paddingHorizontal: 20,
  },
  roundedContainer: {
    backgroundColor: colors.background.bustyBlue,
    padding: 20,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: colors.background.bustyBlue,
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

  textLeftMargin: {
    marginLeft: 10,
  },

  masterText: {
    marginTop: 5,
    color: colors.white,
  },

  rowContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  fieldContainer: {
    flexDirection: 'row',
    backgroundColor: colors.blue2,
    padding: 20,
    borderRadius: 15,
    justifyContent: 'space-between',
  },
  aliasText: {
    color: colors.white,
  },
  copyIcon: {
    margin: 5,
  },
})
