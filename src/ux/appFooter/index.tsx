import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import OIcon from 'react-native-vector-icons/Octicons'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import DappsIcon from 'components/icons/DappsIcon'
import { sharedColors } from 'shared/constants'

interface Props extends BottomTabBarProps {
  isShown: boolean
}

export const AppFooterMenu = ({ navigation, isShown }: Props) => {
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
        <MCIcon name="home-outline" size={30} color={sharedColors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.Activity)}
        style={styles.button}
        accessibilityLabel="activity">
        <OIcon
          name="arrow-switch"
          size={24}
          color={sharedColors.white}
          style={styles.rotation}
        />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.ScanQR)}
        style={[styles.button, styles.centralButton]}
        accessibilityLabel="scan">
        <MCIcon name="line-scan" size={30} color={sharedColors.white} />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.WalletConnect)}
        style={styles.button}
        accessibilityLabel="dapps">
        <DappsIcon />
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate(rootTabsRouteNames.Contacts)}
        style={styles.button}
        accessibilityLabel="contacts">
        <MCIcon
          name="account-multiple-outline"
          size={30}
          color={sharedColors.white}
        />
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
    backgroundColor: sharedColors.secondary,
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
  centralButton: {
    backgroundColor: sharedColors.primary,
    borderRadius: 25,
  },
  rotation: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
})
