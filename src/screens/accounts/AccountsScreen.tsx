import { useMemo, useEffect, useContext } from 'react'
import { View } from 'react-native'

import { shortAddress } from 'lib/utils'

import { AccountBox } from 'components/accounts/AccountBox'
import { useAppSelector } from 'store/storeUtils'
import { selectBitcoin, selectChainId } from 'store/slices/settingsSlice'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedStyles } from 'shared/constants'
import { WalletContext } from 'shared/wallet'

export const AccountsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.AccountsScreen>) => {
  const { wallet, walletIsDeployed } = useContext(WalletContext)

  const chainId = useAppSelector(selectChainId)
  const bitcoinCore = useAppSelector(selectBitcoin)
  const publicKeys = useMemo(
    () =>
      bitcoinCore
        ? bitcoinCore.networksArr.map(network => ({
            publicKey: network.bips[0].accountPublicKey,
            shortedPublicKey: shortAddress(network.bips[0].accountPublicKey, 8),
            networkName: network.networkName,
          }))
        : [],
    [bitcoinCore],
  )

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])

  return (
    <View style={sharedStyles.screen}>
      <AccountBox
        walletIsDeployed={walletIsDeployed}
        address={wallet.address}
        smartWalletAddress={wallet.smartWalletAddress}
        chainId={chainId}
        publicKeys={publicKeys}
      />
    </View>
  )
}
