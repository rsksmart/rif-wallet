import { useMemo, useEffect, useState, useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { useTranslation } from 'react-i18next'

import { shortAddress } from 'lib/utils'
import { RelayWallet } from 'lib/relayWallet'

import { AccountBox } from 'components/accounts/AccountBox'
import { useAppDispatch, useAppSelector } from 'store/storeUtils'
import {
  resetApp,
  selectBitcoin,
  selectChainId,
} from 'store/slices/settingsSlice'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { useWalletState } from 'shared/wallet'
import { castStyle } from 'shared/utils'
import { AppButton, AppButtonBackgroundVarietyEnum } from 'components/index'
import { DeleteWalletModal } from 'components/modal/deleteWalletModal'

export const AccountsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.AccountsScreen>) => {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [isDeleteConfirmationVisible, setIsDeleteConfirmationVisible] =
    useState<boolean>(false)
  const { wallet, walletIsDeployed } = useWalletState()

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

  const eraseWallet = useCallback(() => {
    dispatch(resetApp({ wallet }))
  }, [dispatch, wallet])

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
        eraseWallet={eraseWallet}
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
