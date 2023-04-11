import { useCallback, useMemo, useEffect } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { version } from 'package.json'
import { useTranslation } from 'react-i18next'

import { getWalletSetting, SETTINGS } from 'core/config'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppTouchable, Typography } from 'components/index'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { headerLeftOption } from 'navigation/profileNavigator'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { useAppSelector } from 'src/redux/storeUtils'
import { selectWalletIsDeployed } from 'src/redux/slices/settingsSlice'

export const SettingsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.SettingsScreen>) => {
  const isDeployed = useAppSelector(selectWalletIsDeployed)

  const smartWalletFactoryAddress = useMemo(
    () => getWalletSetting(SETTINGS.SMART_WALLET_FACTORY_ADDRESS),
    [],
  )

  const rpcUrl = useMemo(() => getWalletSetting(SETTINGS.RPC_URL), [])

  const walletServiceUrl = useMemo(
    () => getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
    [],
  )

  const goToAccountsScreen = () =>
    navigation.navigate(settingsStackRouteNames.AccountsScreen)

  const goToWalletBackup = () =>
    navigation.navigate(settingsStackRouteNames.WalletBackup)

  const goToDeploy = () =>
    navigation.navigate(rootTabsRouteNames.Home, {
      screen: homeStackRouteNames.RelayDeployScreen,
    })

  const goToFeedbackScreen = () =>
    navigation.navigate(settingsStackRouteNames.FeedbackScreen)

  const goToExampleScreen = useCallback(() => {
    navigation.navigate(settingsStackRouteNames.ExampleScreen)
  }, [navigation])

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => headerLeftOption(navigation.goBack),
    })
  }, [navigation])
  const { t } = useTranslation()

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
        <AppTouchable
          width={'100%'}
          accessibilityLabel="Change PIN"
          style={styles.settingsItem}
          onPress={() => {}}>
          <Typography type={'h3'}>{t('settings_screen_change_pin')}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="feedback"
          style={styles.settingsItem}
          onPress={goToFeedbackScreen}>
          <Typography type={'h3'}>
            {t('settings_screen_provide_feedback')}
          </Typography>
        </AppTouchable>
        {!isDeployed && (
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
        <AppTouchable
          width={'100%'}
          accessibilityLabel={'example'}
          style={styles.settingsItem}
          onPress={goToExampleScreen}>
          <Typography type={'h3'}>{t('settings_screen_examples')}</Typography>
        </AppTouchable>
      </View>
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
