import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'

import { AddressCopyComponent } from 'components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'
import { ProfileHandler } from './ProfileHandler'
import { navigationContainerRef } from '../../core/Core'
import { IProfileStore } from 'src/storage/MainStorage'
import { rootStackRouteNames } from 'src/navigation/rootNavigator'

interface Props {
  profile: IProfileStore
  profileCreated: boolean
}

export const AppHeader = ({ profile, profileCreated }: Props) => {
  const { wallet, chainId } = useSelectedWallet()

  const openMenu = () => {
    const navState = navigationContainerRef.getCurrentRoute()
    if (navState && navState.name === rootStackRouteNames.Home) {
      navigationContainerRef.navigate(rootStackRouteNames.Settings)
    } else {
      navigationContainerRef.navigate(rootStackRouteNames.Home)
    }
  }

  return (
    <View style={styles.row}>
      <View
        style={{
          ...styles.column,
          ...styles.walletInfo,
        }}>
        <ProfileHandler profile={profile} profileCreated={profileCreated} />
      </View>
      <View style={styles.column}>
        {wallet && (
          <AddressCopyComponent
            address={wallet.smartWalletAddress}
            chainId={chainId}
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
    marginBottom: 10,
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
