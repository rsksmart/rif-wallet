import { StyleSheet, View } from 'react-native'
import { BottomTabBarProps } from '@react-navigation/bottom-tabs'
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import OIcon from 'react-native-vector-icons/Octicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { DappsIcon } from 'components/icons/DappsIcon'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppTouchable } from 'components/appTouchable'
import { ScanIcon } from 'components/icons/ScanIcon'

interface Props extends BottomTabBarProps {
  isShown: boolean
}

const buttonWidth = 52

export const AppFooterMenu = ({ navigation, isShown }: Props) => {
  const { bottom } = useSafeAreaInsets()

  return !isShown ? null : (
    <View
      style={[
        styles.container,
        sharedStyles.paddingHorizontal24,
        { paddingBottom: bottom },
      ]}>
      <AppTouchable
        width={buttonWidth}
        onPress={() =>
          navigation.navigate(rootTabsRouteNames.Home, {
            screen: homeStackRouteNames.Main,
          })
        }
        style={styles.button}
        accessibilityLabel="home">
        <MCIcon name="home-outline" size={30} color={sharedColors.white} />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Activity)}
        style={styles.button}
        accessibilityLabel="activity">
        <OIcon
          name="arrow-switch"
          size={24}
          color={sharedColors.white}
          style={styles.rotation}
        />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.ScanQR)}
        style={[styles.button, styles.centralButton]}
        accessibilityLabel="scan">
        <ScanIcon />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.WalletConnect)}
        style={styles.button}
        accessibilityLabel="dapps">
        <DappsIcon />
      </AppTouchable>

      <AppTouchable
        width={buttonWidth}
        onPress={() => navigation.navigate(rootTabsRouteNames.Contacts)}
        style={styles.button}
        accessibilityLabel="contacts">
        <MCIcon
          name="account-multiple-outline"
          size={30}
          color={sharedColors.white}
        />
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
    backgroundColor: sharedColors.black,
  }),
  button: castStyle.view({
    alignSelf: 'center',
    alignItems: 'center',
    width: buttonWidth,
    height: buttonWidth,
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
