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
import { ScreenProps } from '../../RootNavigation'

export type ProfileDetailsScreenProps = {
  route: any
  onAliasChange: any
}
export const ProfileDetailsScreen: React.FC<
  ScreenProps<'ProfileDetailsScreen'> & ProfileDetailsScreenProps
> = ({ route, onAliasChange }) => {
  return (
    <View style={styles.container}>
      <Text>details</Text>
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
})
