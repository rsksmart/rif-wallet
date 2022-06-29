import React, { useContext } from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { colors } from '../../styles'
import { AppContext } from '../../Context'
import { shortAddress } from '../../lib/utils'
import AddAccountBox from '../../components/accounts/AddAccountBox'
import AccountBox from '../../components/accounts/AccountBox'

export type AccountsScreenType = {
  addNewWallet: any
  switchActiveWallet?: any
}

const AccountsScreen: React.FC<AccountsScreenType> = ({ addNewWallet }) => {
  const { wallets } = useContext(AppContext)
  const walletsArr = React.useMemo(() => {
    return Object.keys(wallets).map(key => ({
      ...wallets[key],
      address: key,
      addressShort: shortAddress(key, 8),
      smartWalletAddress: wallets[key].smartWalletAddress,
      smartWalletAddressShort: shortAddress(wallets[key].smartWalletAddress, 8),
    }))
  }, [wallets])
  return (
    <ScrollView style={styles.container}>
      {walletsArr.length > 0 &&
        walletsArr.map(wallet => (
          <View key={wallet.address} style={styles.walletView}>
            <AccountBox {...wallet} />
          </View>
        ))}
      <AddAccountBox addNewWallet={addNewWallet} />
      <View style={styles.viewBottomFix} />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.blue,
    paddingHorizontal: 40,
    paddingTop: '8%',
  },
  viewBottomFix: {
    marginTop: 150,
  },
  walletView: {
    marginBottom: 40,
  },
})

export default AccountsScreen
