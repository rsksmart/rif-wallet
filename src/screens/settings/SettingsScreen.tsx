import { useMemo, useState } from 'react'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'

import { version } from 'package.json'
import { getWalletSetting, SETTINGS } from '../../core/config'
import { colors, spacing } from '../../styles'
import { MediumText, RegularText, Typography } from 'components/index'
import LockIcon from 'components/icons/LockIcon'
import AccountsIcon from 'components/icons/AccountsIcon'
import { homeStackRouteNames } from 'navigation/homeNavigator/types'
import {
  SettingsScreenProps,
  settingsStackRouteNames,
} from 'navigation/settingsNavigator/types'
import { rootTabsRouteNames } from 'navigation/rootNavigator/types'
import { AppTouchable } from 'src/components/appTouchable'
import { Checkbox } from 'src/components/checkbox'

export const SettingsScreen = ({
  navigation,
}: SettingsScreenProps<settingsStackRouteNames.SettingsScreen>) => {
  const [isEnabled, toggleEnabled] = useState(false)
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainView}>
        {/* @TODO add link to go to the accounts screen */}
        <AppTouchable onPress={() => toggleEnabled(prevState => !prevState)}>
          <Checkbox isEnabled={isEnabled} />
        </AppTouchable>
        <TouchableOpacity
          accessibilityLabel="account"
          style={styles.rowComponent}
          onPress={goToAccountsScreen}>
          <AccountsIcon width={18} height={18} />
          <Typography type={'body1'} style={spacing.ml6}>
            {'Account'}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="security"
          style={styles.rowComponent}
          onPress={goToSecurityConfiguration}>
          <LockIcon />
          <Typography type={'body1'} style={spacing.ml6}>
            {'Security'}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowComponent}
          onPress={goToDeploy}
          accessibilityLabel="deploy">
          <Icon name="wallet-outline" color={colors.white} size={20} />
          <Typography type={'body1'} style={spacing.ml6}>
            {'Smart Wallet Deploy'}
          </Typography>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="feedback"
          style={styles.rowComponent}
          onPress={goToFeedbackScreen}>
          <FontAwesomeIcon name="comment" color={colors.white} size={20} />
          <Typography type={'body1'} style={spacing.ml6}>
            {' Feedback'}
          </Typography>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomView}>
        <View style={styles.versionComp}>
          <MediumText style={[styles.textColor]}>Version {version}</MediumText>
        </View>
        <View style={styles.secondaryTextView}>
          <MediumText style={[styles.primaryTextStyles]}>
            Smart Wallet Factory
          </MediumText>
          <RegularText style={[styles.secondaryTextStyles]}>
            {smartWalletFactoryAddress}
          </RegularText>
        </View>
        <View style={styles.secondaryTextView}>
          <MediumText style={[styles.primaryTextStyles]}>RPC URL</MediumText>
          <RegularText style={[styles.secondaryTextStyles]}>
            {rpcUrl}
          </RegularText>
        </View>
        <View style={styles.secondaryTextView}>
          <MediumText style={[styles.primaryTextStyles]}>
            Backend URL
          </MediumText>
          <RegularText style={[styles.secondaryTextStyles]}>
            {walletServiceUrl}
          </RegularText>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.darkBlue,
    flex: 1,
  },
  mainView: {
    paddingHorizontal: 50,
    marginTop: 80,
    flex: 3,
  },
  bottomView: {
    flex: 2,
    paddingHorizontal: 50,
  },
  rowComponent: {
    marginBottom: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },
  versionComp: {
    marginBottom: 10,
  },
  secondaryTextView: {
    marginBottom: 10,
  },
  textColor: {
    color: colors.text.primary,
  },
  primaryTextStyles: {
    color: colors.text.primary,
    fontSize: 11,
  },
  secondaryTextStyles: {
    color: colors.text.secondary,
    fontSize: 10,
  },
})
