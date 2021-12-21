import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'
import MenuIcon from './MenuIcon'

export const AppHeader: React.FC<{}> = () => {
  const { wallet } = useSelectedWallet()

  const navigation = useNavigation()
  const openMenu = () => navigation.navigate('DevMenu' as any)

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        {wallet && <AddressCopyComponent address={wallet.smartWalletAddress} />}
      </View>
      <View style={styles.column}>
        <TouchableOpacity onPress={openMenu} style={styles.menu}>
          <MenuIcon />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '50%',
  },
  menu: {
    alignItems: 'flex-end',
  },
})
