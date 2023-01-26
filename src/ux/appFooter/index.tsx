import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import ActivityIcon from 'components/icons/ActivityIcon'
import ActivitySelectedIcon from 'components/icons/ActivitySelectedIcon'
import ContactIcon from 'components/icons/ContactIcon'
import ContactSelectedIcon from 'components/icons/ContactSelectedIcon'
import DappsIcon from 'components/icons/DappsIcon'
import DappsSelectedIcon from 'components/icons/DappsSelectedIcon'
import QRCodeIconFooter from 'components/icons/QRCodeIconFooter'
import { colors } from 'src/styles/colors'

interface Props extends BottomTabBarProps {
  isShown: boolean
}

export const AppFooterMenu = ({ navigation, state, isShown }: Props) => {
  return !isShown ? null : (
    <View style={styles.row}>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate(rootTabsRouteNames.Home, {
            screen: homeStackRouteNames.Main,
          })
        }
        style={styles.button}
        accessibilityLabel="home">
        <Image
          style={styles.walletIcon}
          source={
            state.routes[state.index].name === rootTabsRouteNames.Home
              ? require('../../images/footer-menu/wallet.png')
              : require('../../images/footer-menu/wallet-o.png')
          }
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.Activity)}
        style={styles.button}
        accessibilityLabel="activity">
        {state.routes[state.index].name === rootTabsRouteNames.Activity ? (
          <ActivitySelectedIcon />
        ) : (
          <ActivityIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.ScanQR)}
        style={styles.button}
        accessibilityLabel="scan">
        <QRCodeIconFooter />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.Contacts)}
        style={styles.button}
        accessibilityLabel="contacts">
        {state.routes[state.index].name === rootTabsRouteNames.Contacts ? (
          <ContactSelectedIcon />
        ) : (
          <ContactIcon />
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.WalletConnect)}
        style={styles.button}
        accessibilityLabel="dapps">
        {state.routes[state.index].name === rootTabsRouteNames.WalletConnect ? (
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
