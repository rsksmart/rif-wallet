import { useCallback } from 'react'
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native'
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs'

import { getChainIdByType } from 'lib/utils'

import { AddressCopyComponent } from 'components/copy/AddressCopyComponent'
import { rootTabsRouteNames } from 'navigation/rootNavigator'
import { selectActiveWallet, selectTopColor } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { ProfileHandler } from './ProfileHandler'
import { StackHeaderProps } from '@react-navigation/stack'

type Props = BottomTabHeaderProps | StackHeaderProps

export const AppHeader = ({ navigation, route }: Props) => {
  const topColor = useAppSelector(selectTopColor)
  const { wallet, chainType } = useAppSelector(selectActiveWallet)

  const openMenu = useCallback(() => {
    if (route && route.name === rootTabsRouteNames.Settings) {
      navigation.navigate(rootTabsRouteNames.Home)
      return
    }
    navigation.navigate(rootTabsRouteNames.Settings)
  }, [navigation])

  return (
    <View style={[styles.row, { backgroundColor: topColor }]}>
      <View style={[styles.column, styles.walletInfo]}>
        {wallet && <ProfileHandler wallet={wallet} navigation={navigation} />}
      </View>
      <View style={styles.column}>
        {wallet && (
          <AddressCopyComponent
            address={wallet.smartWalletAddress}
            chainId={getChainIdByType(chainType) || 31}
          />
        )}
      </View>
      <View style={styles.columnMenu}>
        <TouchableOpacity onPress={openMenu} accessibilityLabel="settings">
          <Image
            source={require('../../images/settings-icon.png')}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center', // vertical
    paddingVertical: 10,
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
