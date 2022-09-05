import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { colors } from '../../styles/colors'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()
  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Home' as never)}
        style={styles.button}>
        <Image
          source={
            currentScreen === 'Home'
              ? require('../../images/footer-menu/home.png')
              : require('../../images/footer-menu/home-o.png')
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Activity' as never)}
        style={styles.button}>
        <Image
          source={
            currentScreen === 'Activity'
              ? require('../../images/footer-menu/activity.png')
              : require('../../images/footer-menu/activity-o.png')
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Contacts' as never)}
        style={styles.button}>
        <Image
          source={
            currentScreen === 'Contacts'
              ? require('../../images/footer-menu/contacts.png')
              : require('../../images/footer-menu/contacts-o.png')
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Dapps' as never)}
        style={styles.button}>
        <Image
          source={
            currentScreen === 'Dapps'
              ? require('../../images/footer-menu/dapps.png')
              : require('../../images/footer-menu/dapps-o.png')
          }
        />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
    backgroundColor: colors.darkPurple3,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    borderBottomWidth: 4,
    borderColor: colors.none,
  },
})
