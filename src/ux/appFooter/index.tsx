import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { AppTouchable } from 'components/appTouchable'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import HomeIcon from 'components/icons/HomeIcon'
import NetworkIcon from 'components/icons/NetworkIcon'
import { ScanIcon } from 'components/icons/ScanIcon'
import TransactionsIcon from 'components/icons/TransactionsIcon'
import UsersIcon from 'components/icons/UsersIcon'

const buttonWidth = 52

export const AppFooterMenu = ({ navigation }: BottomTabBarProps) => {
  const { bottom } = useSafeAreaInsets()

  const { routeNames, index } = navigation.getState()
  const currentRouteName = routeNames[index]

  return (
    <View
      style={[
        styles.container,
        sharedStyles.paddingHorizontal24,
        { paddingBottom: bottom + 4 },
      ]}>
      <AppTouchable
        width={buttonWidth}
        onPress={() =>
          navigation.navigate(rootTabsRouteNames.Home, {
            screen: homeStackRouteNames.Main,
          })
        }
        accessibilityLabel="home">
        <HomeIcon active={currentRouteName === rootTabsRouteNames.Home} />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Activity)}
        accessibilityLabel="activity">
        <TransactionsIcon
          active={currentRouteName === rootTabsRouteNames.Activity}
          style={styles.rotation}
        />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.ScanQR)}
        accessibilityLabel="scan">
        <ScanIcon active={currentRouteName === rootTabsRouteNames.ScanQR} />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.WalletConnect)}
        accessibilityLabel="dapps">
        <NetworkIcon
          active={currentRouteName === rootTabsRouteNames.WalletConnect}
        />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Contacts)}
        accessibilityLabel="contacts">
        <UsersIcon active={currentRouteName === rootTabsRouteNames.Contacts} />
      </AppTouchable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: sharedColors.background.primary,
  }),
  walletIcon: {
    height: 20,
    resizeMode: 'contain',
  },
  centralButton: castStyle.view({
    backgroundColor: sharedColors.primary,
    borderRadius: 26,
  }),
  rotation: {
    transform: [
      {
        rotate: '-45deg',
      },
    ],
  },
})
