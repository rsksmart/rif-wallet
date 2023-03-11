import { useMemo, useEffect } from 'react'
import { StyleSheet, View, FlatList } from 'react-native'

import { shortAddress } from 'lib/utils'

import AccountBox from 'components/accounts/AccountBox'
import { colors } from 'src/styles'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectWallets } from 'src/redux/slices/settingsSlice'
import { useBitcoinContext } from 'core/hooks/bitcoin/BitcoinContext'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'

export const AccountsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.AccountsScreen>) => {
  const wallets = useAppSelector(selectWallets)
  const bitcoinCore = useBitcoinContext()
  const publicKeys = useMemo(
    () =>
      bitcoinCore
        ? bitcoinCore.networks.map(network => ({
            publicKey: network.bips[0].accountPublicKey,
            shortedPublicKey: shortAddress(network.bips[0].accountPublicKey, 8),
            networkName: network.networkName,
          }))
        : [],
    [bitcoinCore],
  )
  const walletsArr = useMemo(
    () =>
      wallets
        ? Object.keys(wallets).map((key, id) => ({
            ...wallets[key],
            address: key,
            addressShort: shortAddress(key, 8),
            smartWalletAddress: wallets[key].smartWalletAddress,
            smartWalletAddressShort: shortAddress(
              wallets[key].smartWalletAddress,
              8,
            ),
            id,
          }))
        : [],
    [wallets],
  )

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

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
