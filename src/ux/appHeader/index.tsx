import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'
import { Network } from '@ethersproject/networks'
import { MenuIcon } from '../../components/icons/MenuIcon'
import { colors } from '../../styles/colors'

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

export const AppHeader: React.FC<{}> = () => {
  const { wallet } = useSelectedWallet()

  const navigation = useNavigation()
  const openMenu = () => navigation.navigate('Settings' as any)
  const [network, setNetwork] = React.useState<null | Network>(null)

  const handleNetworkInfo = async () => {
    const currentNetwork = await wallet.provider?.getNetwork()
    setNetwork(networks[(currentNetwork as Network).chainId])
  }

  React.useEffect(() => {
    handleNetworkInfo()
  }, [wallet])

  return (
    <View style={styles.row}>
      <View
        style={{
          ...styles.column,
          ...styles.walletInfo,
        }}>
        {wallet && <AddressCopyComponent address={wallet.smartWalletAddress} />}
        {network && <Text style={styles.network}>{network.name}</Text>}
      </View>
      <View style={styles.column}>
        <TouchableOpacity onPress={openMenu} style={styles.menu}>
          <MenuIcon color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    alignItems: 'center',
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: colors.blue,
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '50%',
  },
  network: {
    color: colors.white,
  },
  walletInfo: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  menu: {
    alignItems: 'flex-end',
  },
})
