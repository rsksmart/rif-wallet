import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { colors } from '../../styles/colors'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()
  const selectedStyle = {
    ...styles.button,
    borderBottomColor: colors.blue,
  }

  return (
    <LinearGradient
      colors={[colors.none, colors.darkPurple3]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 2 }}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dapps' as never)}
          style={currentScreen === 'Dapps' ? selectedStyle : styles.button}>
          <Image source={require('../../images/footer-menu/blocks.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Home' as never)}
          style={currentScreen === 'Home' ? selectedStyle : styles.button}>
          <Image source={require('../../images/footer-menu/wallet.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Activity' as never)}
          style={currentScreen === 'Activity' ? selectedStyle : styles.button}>
          <Image source={require('../../images/footer-menu/coins.png')} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('Contacts' as never)}
          style={currentScreen === 'Contacts' ? selectedStyle : styles.button}>
          <Image source={require('../../images/footer-menu/contacts.png')} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    paddingTop: 20,
  },
  row: {
    padding: 10,
    paddingBottom: 40,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
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
