import { useCallback, useMemo, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { version } from 'package.json'

import { getWalletSetting, SETTINGS } from 'core/config'
import {
  AppTouchable,
  Typography,
} from 'components/index'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { sharedColors } from 'shared/constants'
import { headerLeftOption, headerStyles } from 'navigation/profileNavigator'

export const SettingsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.SettingsScreen>) => {
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

  const goToSecurityConfiguration = () =>
    navigation.navigate(settingsStackRouteNames.SecurityConfigurationScreen)

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
      headerLeft: () => headerLeftOption(() => navigation.goBack()),
      headerStyle: [
        headerStyles.headerStyle,
        { backgroundColor: sharedColors.tokenBackground },
      ],
    })
  }, [navigation])

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        {/* @TODO add link to go to the accounts screen */}
        <AppTouchable
          width={'100%'}
          accessibilityLabel="account"
          style={styles.settingsItem}
          onPress={goToAccountsScreen}>
          <Typography type={'h3'}>{'Account'}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="security"
          style={styles.settingsItem}
          onPress={goToSecurityConfiguration}>
          <Typography type={'h3'}>{'Security'}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          style={styles.settingsItem}
          onPress={goToDeploy}
          accessibilityLabel="deploy">
          <Typography type={'h3'}>{'Smart Wallet Deploy'}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="feedback"
          style={styles.settingsItem}
          onPress={goToFeedbackScreen}>
          <Typography type={'h3'}>{'Provide feedback'}</Typography>
        </AppTouchable>
        <AppTouchable
          width={'100%'}
          accessibilityLabel={'example'}
          style={styles.settingsItem}
          onPress={goToExampleScreen}>
          <Typography type={'h3'}>{'Example Screen'}</Typography>
        </AppTouchable>
      </View>
      <View style={styles.bottomView}>
        <AppTouchable
          width={'100%'}
          accessibilityLabel="version"
          style={styles.footerItem}
          onPress={goToSecurityConfiguration}>
          <Typography type={'body1'} color={sharedColors.labelLight}>
            {'Version'} {version}
          </Typography>
        </AppTouchable>

        <AppTouchable
          width={'100%'}
          accessibilityLabel="Smart Wallet Factory"
          style={styles.footerItem}
          onPress={goToSecurityConfiguration}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {'Smart Wallet Factory'}
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
          onPress={goToSecurityConfiguration}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {'RPC URL'}
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
          onPress={goToSecurityConfiguration}>
          <>
            <Typography type={'h4'} color={sharedColors.labelLight}>
              {'Backend URL'}
            </Typography>
            <Typography type={'h5'} color={sharedColors.labelLight}>
              {walletServiceUrl}
            </Typography>
          </>
        </AppTouchable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: sharedColors.tokenBackground,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  mainView: {
    marginTop: 40,
    alignContent: 'flex-start',
  },
  bottomView: {
    marginBottom: 30,
  },
  settingsItem: {
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  footerItem: {
    marginBottom: 15,
    alignItems: 'flex-start',
  },
})
