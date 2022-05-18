import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'
import { Network } from '@ethersproject/networks'
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
        <Image
          source={require('../../images/rsk-logo.png')}
          style={styles.logo}
        />
        {network && <Text style={styles.network}>{network.name}</Text>}
      </View>
      <View style={styles.column}>
        {wallet && <AddressCopyComponent address={wallet.smartWalletAddress} />}
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
    padding: 10,
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
  network: {
    color: colors.white,
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
