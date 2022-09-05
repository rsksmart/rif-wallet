import React from 'react'
import MaterialIcon from 'react-native-vector-icons/MaterialIcons'

import { IProfileStore } from '../../storage/ProfileStore'

import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { ScreenProps } from '../../RootNavigation'
import { MediumText } from '../../components'

export type ProfileDetailsScreenProps = {
  route: any
  navigation: any
}
export const ProfileDetailsScreen: React.FC<
  ScreenProps<'ProfileDetailsScreen'> & ProfileDetailsScreenProps
> = ({ route, navigation }) => {
  const initialProfile: IProfileStore = route.params.profile
  return (
    <>
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
              profile: initialProfile,
            })
          }>
          <MaterialIcon name="edit" color="white" size={20} />
        </TouchableOpacity>
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

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              {initialProfile.alias}
            </MediumText>
          </View>
        </View>

        <View>
          <MediumText style={[styles.masterText, styles.textLeftMargin]}>
            phone
          </MediumText>
        </View>

        <View style={styles.rowContainer}>
          <View style={styles.fieldContainer}>
            <MediumText style={[styles.masterText, styles.textLeftMargin]}>
              {initialProfile.phone}
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
              {initialProfile.email}
            </MediumText>
          </View>
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

  textLeftMargin: {
    marginLeft: 10,
  },

  masterText: {
    marginBottom: 0,
    color: colors.white,
  },

  rowContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  fieldContainer: {
    backgroundColor: colors.blue2,
    padding: 20,
    borderRadius: 15,
  },
  aliasText: {
    color: colors.white,
  },
})
