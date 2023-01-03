import { useNavigation } from '@react-navigation/core'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'

import {
  RootStackNavigationProp,
  rootStackRouteNames,
} from 'navigation/rootNavigator'
import ActivityIcon from 'components/icons/ActivityIcon'
import ActivitySelectedIcon from 'components/icons/ActivitySelectedIcon'
import ContactIcon from 'components/icons/ContactIcon'
import ContactSelectedIcon from 'components/icons/ContactSelectedIcon'
import DappsIcon from 'components/icons/DappsIcon'
import DappsSelectedIcon from 'components/icons/DappsSelectedIcon'
import QRCodeIconFooter from 'components/icons/QRCodeIconFooter'
import { colors } from '../../styles/colors'

interface Props {
  currentScreen: string
}

export const AppFooterMenu = ({ currentScreen }: Props) => {
  const navigation = useNavigation<RootStackNavigationProp>()

  return (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() => navigation.navigate(rootStackRouteNames.Home)}
        style={styles.button}
        accessibilityLabel="home">
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
        onPress={() => navigation.navigate(rootStackRouteNames.Activity)}
        style={styles.button}
        accessibilityLabel="activity">
        {currentScreen === 'Activity' ? (
          <ActivitySelectedIcon />
        ) : (
          <ActivityIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootStackRouteNames.ScanQR)}
        style={styles.button}
        accessibilityLabel="scan">
        <QRCodeIconFooter />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootStackRouteNames.Contacts)}
        style={styles.button}
        accessibilityLabel="contacts">
        {currentScreen === 'Contacts' ? (
          <ContactSelectedIcon />
        ) : (
          <ContactIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootStackRouteNames.WalletConnect)}
        style={styles.button}
        accessibilityLabel="dapps">
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
