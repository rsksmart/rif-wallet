import { useNavigation } from '@react-navigation/core'

import React from 'react'
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'
import { Network } from '@ethersproject/networks'
import { ProfileHandler } from './ProfileHandler'
import { IProfileStore } from '../../storage/ProfileStore'

export const networks: Record<number, Network> = {
  30: {
    chainId: 30,
    name: 'RSK Mainnet',
  },
  31: {
    chainId: 31,
    name: 'RSK Testnet',
  },
}

export const AppHeader: React.FC<{ profile: IProfileStore | undefined }> = ({
  profile,
}) => {
  const { wallet, chainId } = useSelectedWallet()
  const navigation = useNavigation()
  const openMenu = () => navigation.navigate('Settings' as any)
  return (
    <View style={styles.row}>
      <View
        style={{
          ...styles.column,
          ...styles.walletInfo,
        }}>
        <ProfileHandler navigation={navigation} profile={profile} />
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
        <TouchableOpacity onPress={openMenu}>
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
