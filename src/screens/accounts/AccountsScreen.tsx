import React, { useContext } from 'react'
import { StyleSheet, ScrollView } from 'react-native'
import { colors } from '../../styles'
import { AppContext } from '../../Context'
import { shortAddress } from '../../lib/utils'
import AddAccountBox from '../../components/accounts/AddAccountBox'
import AccountBox from '../../components/accounts/AccountBox'

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.blue,
    paddingHorizontal: 40,
    paddingTop: '8%',
  },
})

const AccountsScreen = () => {
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
        walletsArr.map(wallet => <AccountBox {...wallet} />)}
      <AddAccountBox />
    </ScrollView>
  )
}

export default AccountsScreen
