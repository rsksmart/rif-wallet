import { useMemo, useEffect, useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { shortAddress } from 'lib/utils'
import { RelayWallet } from 'lib/relayWallet'

import { AccountBox } from 'components/accounts/AccountBox'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import { selectBitcoin, selectChainId } from 'store/slices/settingsSlice'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { useWalletState } from 'shared/wallet'
import { AppButton, AppButtonBackgroundVarietyEnum } from 'components/index'
import { DeleteWalletModal } from 'components/modal/deleteWalletModal'
import { castStyle } from 'shared/utils'

export const AccountsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.AccountsScreen>) => {
  const { t } = useTranslation()
  const { wallet, walletIsDeployed } = useWalletState()
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)

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
        smartWalletAddress={
          wallet instanceof RelayWallet ? wallet.smartWalletAddress : null
        }
        chainId={chainId}
        publicKeys={publicKeys}
      />
      <AppButton
        title={t('wallet_backup_delete_button')}
        onPress={() => setIsDeleteConfirmationVisible(true)}
        backgroundVariety={AppButtonBackgroundVarietyEnum.OUTLINED}
        color={sharedColors.white}
        style={styles.deleteButton}
      />
      <DeleteWalletModal
        isVisible={isDeleteConfirmationVisible}
        setVisible={setIsDeleteConfirmationVisible}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  deleteButton: castStyle.view({
    marginTop: 24,
  }),
})
