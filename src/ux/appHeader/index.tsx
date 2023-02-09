import { useCallback } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'
import { StackHeaderProps } from '@react-navigation/stack'
import OIcon from 'react-native-vector-icons/Octicons'

import { ChevronLeftIcon } from 'components/icons/ChevronLeftIcon'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { selectActiveWallet, selectTopColor } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ProfileHandler } from './ProfileHandler'
import { sharedColors } from 'shared/constants'

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
        <TouchableOpacity onPress={navigation.goBack}>
          <ChevronLeftIcon color={'white'} />
        </TouchableOpacity>
      ) : null}
      <View style={[styles.column, styles.walletInfo]}>
        {wallet && <ProfileHandler wallet={wallet} navigation={navigation} />}
      </View>
      <View style={styles.columnMenu}>
        <TouchableOpacity onPress={openMenu} accessibilityLabel="settings">
          <OIcon name="gear" size={15} color={sharedColors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center', // vertical
    paddingVertical: 5,
    paddingHorizontal: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    flex: 5,
  },
  columnMenu: {
    flex: 1,
    alignItems: 'flex-end',
  },
  logo: {
    height: 25,
    width: 18,
    marginRight: 5,
  },

  walletInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  settingsIcon: {
    height: 18,
    width: 18,
  },
})
