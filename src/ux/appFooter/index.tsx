import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import ActivityIcon from '../../components/icons/ActivityIcon'
import ActivitySelectedIcon from '../../components/icons/ActivitySelectedIcon'
import ContactIcon from '../../components/icons/ContactIcon'
import ContactSelectedIcon from '../../components/icons/ContactSelectedIcon'
import DappsIcon from '../../components/icons/DappsIcon'
import DappsSelectedIcon from '../../components/icons/DappsSelectedIcon'
import HomeIcon from '../../components/icons/HomeIcon'
import HomeSelectedIcon from '../../components/icons/HomeSelectedIcon'
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
        {currentScreen === 'Home' ? <HomeSelectedIcon /> : <HomeIcon />}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Activity' as never)}
        style={styles.button}>
        {currentScreen === 'Activity' ? (
          <ActivitySelectedIcon />
        ) : (
          <ActivityIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Contacts' as never)}
        style={styles.button}>
        {currentScreen === 'Contacts' ? (
          <ContactSelectedIcon />
        ) : (
          <ContactIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate('Dapps' as never)}
        style={styles.button}>
        {currentScreen === 'Dapps' ? <DappsSelectedIcon /> : <DappsIcon />}
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
