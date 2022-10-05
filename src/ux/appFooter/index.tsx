import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import ActivityIcon from '../../components/icons/ActivityIcon'
import ActivitySelectedIcon from '../../components/icons/ActivitySelectedIcon'
import ContactIcon from '../../components/icons/ContactIcon'
import ContactSelectedIcon from '../../components/icons/ContactSelectedIcon'
import DappsIcon from '../../components/icons/DappsIcon'
import DappsSelectedIcon from '../../components/icons/DappsSelectedIcon'
import QRCodeIconFooter from '../../components/icons/QRCodeIconFooter'
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
          style={styles.walletIcon}
          source={
            currentScreen === 'Home'
              ? require('../../images/footer-menu/wallet.png')
              : require('../../images/footer-menu/wallet-o.png')
          }
        />
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
        onPress={() => navigation.navigate('WalletConnect' as never)}
        style={styles.button}>
        <QRCodeIconFooter />
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
        onPress={() => navigation.navigate('WalletConnect' as never)}
        style={styles.button}>
        {currentScreen === 'WalletConnect' ? (
          <DappsSelectedIcon />
        ) : (
          <DappsIcon />
        )}
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    paddingBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: '10%',
    backgroundColor: colors.darkPurple3,
  },
  button: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    display: 'flex',
    alignItems: 'center',
    width: 50,
  },
  walletIcon: {
    height: 20,
    resizeMode: 'contain',
  },
})
