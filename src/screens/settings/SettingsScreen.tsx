import { version } from 'package.json'
import { useCallback, useContext, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, ScrollView, StyleSheet, View } from 'react-native'

import { AppTouchable, Typography } from 'components/index'
import { getWalletSetting } from 'core/config'
import { SETTINGS } from 'core/types'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { selectChainId } from 'store/slices/settingsSlice'
import { selectPin } from 'store/slices/persistentDataSlice'
import { useAppSelector } from 'store/storeUtils'
import { ChainTypeEnum, chainTypesById } from 'shared/constants/chainConstants'
import { GlobalErrorHandlerContext } from 'components/GlobalErrorHandler/GlobalErrorHandlerContext'
import { getCurrentChainId, setCurrentChainId } from 'storage/ChainStorage'
import { WalletContext } from 'shared/wallet'

const ChainTypesInversed = {
  [ChainTypeEnum.TESTNET]: ChainTypeEnum.MAINNET,
  [ChainTypeEnum.MAINNET]: ChainTypeEnum.TESTNET,
}

export const SettingsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.SettingsScreen>) => {
  const statePIN = useAppSelector(selectPin)
  const chainId = useAppSelector(selectChainId)
  const { walletIsDeployed } = useContext(WalletContext)

  const smartWalletFactoryAddress = useMemo(
    () =>
      getWalletSetting(
        SETTINGS.SMART_WALLET_FACTORY_ADDRESS,
        chainTypesById[chainId],
      ),
    [chainId],
  )

  const rpcUrl = useMemo(
    () => getWalletSetting(SETTINGS.RPC_URL, chainTypesById[chainId]),
    [chainId],
  )

  const walletServiceUrl = useMemo(
    () =>
      getWalletSetting(
        SETTINGS.RIF_WALLET_SERVICE_URL,
        chainTypesById[chainId],
      ),
    [chainId],
  )

  const goToAccountsScreen = () =>
    navigation.navigate(settingsStackRouteNames.AccountsScreen)

  const goToWalletBackup = () =>
    navigation.navigate(settingsStackRouteNames.WalletBackup)

  const goToDeploy = () =>
    navigation.navigate(settingsStackRouteNames.RelayDeployScreen)

  const goToExampleScreen = useCallback(() => {
    navigation.navigate(settingsStackRouteNames.ExampleScreen)
  }, [navigation])

  const goToPinScreen = useCallback(() => {
    navigation.navigate(settingsStackRouteNames.ChangePinScreen, {
      isChangeRequested: true,
      backScreen: settingsStackRouteNames.SettingsScreen,
    })
  }, [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])
  const { t } = useTranslation()

  const { handleReload } = useContext(GlobalErrorHandlerContext)
  const onSwitchChains = () => {
    const currentChainId = getCurrentChainId()
    setCurrentChainId(currentChainId === 31 ? 30 : 31)
    handleReload()
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainView}>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="account"
          style={[styles.settingsItem, sharedStyles.marginTop40]}
          onPress={goToAccountsScreen}>
          <Typography type={'h3'}>{t('settings_screen_account')}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="Wallet Backup"
          style={styles.settingsItem}
          onPress={goToWalletBackup}>
          <Typography type={'h3'}>
            {t('settings_screen_wallet_backup')}
          </Typography>
        </AppTouchable>
        {Platform.OS === 'android' && statePIN && (
          <AppTouchable
            width={'100%'}
            accessibilityLabel="Change PIN"
            style={styles.settingsItem}
            onPress={goToPinScreen}>
            <Typography type={'h3'}>
              {t('settings_screen_change_pin')}
            </Typography>
          </AppTouchable>
        )}
        {!walletIsDeployed?.isDeployed && (
          <AppTouchable
            width={'100%'}
            style={styles.settingsItem}
            onPress={goToDeploy}
            accessibilityLabel="Deploy Wallet">
            <Typography type={'h3'}>
              {t('settings_screen_deploy_wallet')}
            </Typography>
          </AppTouchable>
        )}
        {__DEV__ && (
          <AppTouchable
            width={'100%'}
            accessibilityLabel={'example'}
            style={styles.settingsItem}
            onPress={goToExampleScreen}>
            <Typography type={'h3'}>{t('settings_screen_examples')}</Typography>
          </AppTouchable>
        )}
      </View>
      <AppTouchable
        width={'100%'}
        accessibilityLabel="Wallet Backup"
        style={styles.settingsItem}
        onPress={onSwitchChains}>
        <Typography type={'h3'}>
          {`${t('settings_screen_switch_to')} ${
            ChainTypesInversed[chainTypesById[chainId]]
          }`}
        </Typography>
      </AppTouchable>
      <View style={styles.bottomView}>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="version"
          style={styles.footerItem}
          onPress={goToWalletBackup}>
          <Typography type={'body1'} color={sharedColors.labelLight}>
            {t('settings_screen_version')} {version}
          </Typography>
        </AppTouchable>

        <AppTouchable
          width={'100%'}
          accessibilityLabel="Smart Wallet Factory"
          style={styles.footerItem}
          onPress={goToWalletBackup}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {t('settings_screen_smart_wallet_factory')}
            </Typography>
            <Typography type={'h5'} color={sharedColors.labelLight}>
              {smartWalletFactoryAddress}
            </Typography>
          </>
        </AppTouchable>

        <AppTouchable
          width={'100%'}
          accessibilityLabel="security"
          style={styles.footerItem}
          onPress={goToWalletBackup}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {t('settings_screen_rpc_url')}
            </Typography>
            <Typography type={'h5'} color={sharedColors.labelLight}>
              {rpcUrl}
            </Typography>
          </>
        </AppTouchable>

        <AppTouchable
          width={'100%'}
          accessibilityLabel="Backend URL"
          style={styles.footerItem}
          onPress={goToWalletBackup}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {t('settings_screen_backend_url')}
            </Typography>
            <Typography type={'h5'} color={sharedColors.labelLight}>
              {walletServiceUrl}
            </Typography>
          </>
        </AppTouchable>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    height: '100%',
    backgroundColor: sharedColors.black,
    paddingHorizontal: 24,
  }),
  mainView: castStyle.view({
    marginTop: 40,
    alignContent: 'flex-start',
  }),
  bottomView: castStyle.view({
    marginTop: 130,
  }),
  settingsItem: castStyle.view({
    marginTop: 20,
    alignItems: 'flex-start',
  }),
  footerItem: castStyle.view({
    marginBottom: 15,
    alignItems: 'flex-start',
  }),
})
