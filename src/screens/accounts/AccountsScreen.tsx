import React, { useContext } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'
import { colors } from '../../styles'
import { AppContext, useBitcoinCoreContext } from '../../Context'
import { shortAddress } from '../../lib/utils'
import AccountBox from '../../components/accounts/AccountBox'
import { PublicKeyItemType } from './types'

export type AccountsScreenType = {
  switchActiveWallet?: any
}

const AccountsScreen: React.FC<AccountsScreenType> = () => {
  const { wallets } = useContext(AppContext)
  const { networks } = useBitcoinCoreContext()
  const publicKeys: PublicKeyItemType[] = React.useMemo(
    () =>
      networks.map(network => ({
        publicKey: network.bips[0].accountPublicKey,
        shortedPublicKey: shortAddress(network.bips[0].accountPublicKey, 8),
        networkName: network.networkName,
      })),
    [networks],
  )
  const walletsArr = React.useMemo(() => {
    return Object.keys(wallets).map((key, id) => ({
      ...wallets[key],
      address: key,
      addressShort: shortAddress(key, 8),
      smartWalletAddress: wallets[key].smartWalletAddress,
      smartWalletAddressShort: shortAddress(wallets[key].smartWalletAddress, 8),
      id,
    }))
  }, [wallets])
  return (
    <FlatList
      data={walletsArr}
      initialNumToRender={10}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => (
        <AccountBox {...item} publicKeys={publicKeys} />
      )}
      style={styles.container}
      ItemSeparatorComponent={() => <View style={styles.walletView} />}
      ListFooterComponentStyle={styles.viewBottomFix}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.blue,
    paddingHorizontal: 40,
    paddingTop: '8%',
  },
  viewBottomFix: {
    marginTop: 40,
    marginBottom: 150,
  },
  walletView: {
    marginBottom: 40,
  },
})

export default AccountsScreen
