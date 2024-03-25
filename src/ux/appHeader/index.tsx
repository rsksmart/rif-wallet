import { useCallback, useContext } from 'react'
import { StyleSheet, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { StackHeaderProps } from '@react-navigation/stack'
import OIcon from 'react-native-vector-icons/Octicons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { selectChainId, selectTopColor } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'
import { castStyle } from 'shared/utils'
import { Typography } from 'src/components'
import { WalletContext } from 'shared/wallet'

import { ProfileHandler } from './ProfileHandler'

type HeaderProps = BottomTabHeaderProps | StackHeaderProps

export const AppHeader = ({ navigation, route }: HeaderProps) => {
  const insets = useSafeAreaInsets()
  const topColor = useAppSelector(selectTopColor)
  const { wallet } = useContext(WalletContext)
  const chainId = useAppSelector(selectChainId)

  const openMenu = useCallback(() => {
    if (route?.name === rootTabsRouteNames.Settings) {
      navigation.navigate(rootTabsRouteNames.Home)
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: rootTabsRouteNames.Settings }],
      })
    }
  }, [navigation, route])

  return (
    <View
      style={[
        styles.row,
        { backgroundColor: topColor, paddingTop: insets.top + 5 },
      ]}>
      <View style={[styles.column, styles.walletInfo]}>
        {wallet && <ProfileHandler wallet={wallet} navigation={navigation} />}
      </View>
      {chainId === 31 && (
        <View>
          <Typography type="h4">TESTNET</Typography>
        </View>
      )}
      <View style={styles.columnMenu}>
        <AppTouchable
          width={16}
          onPress={openMenu}
          accessibilityLabel="settings">
          <OIcon name="gear" size={16} color={sharedColors.text.primary} />
        </AppTouchable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: castStyle.view({
    alignItems: 'center', // vertical
    paddingVertical: 5,
    paddingHorizontal: 24,
    display: 'flex',
    flexDirection: 'row',
  }),
  column: castStyle.view({
    flex: 5,
  }),
  columnMenu: castStyle.view({
    flex: 1,
    alignItems: 'flex-end',
  }),
  walletInfo: castStyle.view({
    alignItems: 'center',
    flexDirection: 'row',
  }),
})
