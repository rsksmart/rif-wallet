import { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { StackHeaderProps } from '@react-navigation/stack'
import OIcon from 'react-native-vector-icons/Octicons'

import { ChevronLeftIcon } from 'components/icons/ChevronLeftIcon'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { selectActiveWallet, selectTopColor } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ProfileHandler } from './ProfileHandler'
import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'
import { castStyle } from 'shared/utils'

type HeaderProps = BottomTabHeaderProps | StackHeaderProps

interface Props {
  isShown: boolean
}

export const AppHeader = ({
  navigation,
  route,
  isShown,
}: Props & HeaderProps) => {
  const topColor = useAppSelector(selectTopColor)
  const { wallet } = useAppSelector(selectActiveWallet)

  const openMenu = useCallback(() => {
    if (route && route.name === rootTabsRouteNames.Settings) {
      navigation.navigate(rootTabsRouteNames.Home)
      return
    }
    navigation.navigate(rootTabsRouteNames.Settings)
  }, [navigation, route])

  return !isShown ? null : (
    <View style={[styles.row, { backgroundColor: topColor }]}>
      {navigation.canGoBack() ? (
        <AppTouchable width={24} onPress={navigation.goBack}>
          <ChevronLeftIcon color={'white'} />
        </AppTouchable>
      ) : null}
      <View style={[styles.column, styles.walletInfo]}>
        {wallet && <ProfileHandler wallet={wallet} navigation={navigation} />}
      </View>
      <View style={styles.columnMenu}>
        <AppTouchable
          width={16}
          onPress={openMenu}
          accessibilityLabel="settings">
          <OIcon name="gear" size={16} color={sharedColors.white} />
        </AppTouchable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: castStyle.view({
    alignItems: 'center', // vertical
    paddingVertical: 5,
    paddingHorizontal: 15,
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
