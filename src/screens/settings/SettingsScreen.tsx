import React from 'react'
import { ScreenProps } from '../../RootNavigation'
import { StyleSheet, View, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { version } from '../../../package.json'
import { getWalletSetting, SETTINGS } from '../../core/config'
import { colors, spacing } from '../../styles'
import { MediumText, RegularText, SemiBoldText } from '../../components'
import DiscoverTuneIcon from '../../components/icons/DiscoverTuneIcon'
import LockIcon from '../../components/icons/LockIcon'
import AccountsIcon from '../../components/icons/AccountsIcon'

export const SettingsScreen: React.FC<ScreenProps<'Settings'>> = ({
  navigation,
}) => {
  const smartWalletFactoryAddress = React.useMemo(
    () => getWalletSetting(SETTINGS.SMART_WALLET_FACTORY_ADDRESS),
    [],
  )

  const rpcUrl = React.useMemo(() => getWalletSetting(SETTINGS.RPC_URL), [])

  const walletServiceUrl = React.useMemo(
    () => getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
    [],
  )

  const goToChangeLanguage = () => navigation.navigate('ChangeLanguage' as any)

  const goToAccountsScreen = () => navigation.navigate('AccountsScreen' as any)

  const goToRelayScreen = () => navigation.navigate('RelayDeployScreen')

  // const goToSecurityConfiguration = () =>
  //   navigation.navigate('SecurityConfiguration' as any)
  const goToSecurityConfiguration = () =>
    navigation.navigate('SecurityConfigurationScreen' as any)

  const goToDeploy = () => navigation.navigate('ManuallyDeployScreen')

  return (
    <View style={styles.container}>
      <View style={styles.mainView}>
        <TouchableOpacity
          onPress={goToChangeLanguage}
          style={styles.rowComponent}>
          <DiscoverTuneIcon width={18} height={18} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            General
          </SemiBoldText>
        </TouchableOpacity>
        {/* @TODO add link to go to the accounts screen */}
        <TouchableOpacity
          style={styles.rowComponent}
          onPress={goToAccountsScreen}>
          <AccountsIcon width={18} height={18} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Accounts
          </SemiBoldText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowComponent}
          onPress={goToSecurityConfiguration}>
          <LockIcon />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Security
          </SemiBoldText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rowComponent} onPress={goToRelayScreen}>
          <Icon name="wallet-outline" color={colors.white} size={20} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Smart Wallet Deploy
          </SemiBoldText>
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
    </View>
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
