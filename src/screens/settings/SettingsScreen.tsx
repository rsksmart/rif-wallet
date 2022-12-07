import { useMemo } from 'react'
import { RootStackScreenProps } from 'navigation/rootNavigator/types'
import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome5'
import { version } from '../../../package.json'
import { getWalletSetting, SETTINGS } from '../../core/config'
import { colors, spacing } from '../../styles'
import { MediumText, RegularText, SemiBoldText } from '../../components'
import DiscoverTuneIcon from '../../components/icons/DiscoverTuneIcon'
import LockIcon from '../../components/icons/LockIcon'
import AccountsIcon from '../../components/icons/AccountsIcon'

export const SettingsScreen = ({
  navigation,
}: RootStackScreenProps<'Settings'>) => {
  const smartWalletFactoryAddress = useMemo(
    () => getWalletSetting(SETTINGS.SMART_WALLET_FACTORY_ADDRESS),
    [],
  )

  const rpcUrl = useMemo(() => getWalletSetting(SETTINGS.RPC_URL), [])

  const walletServiceUrl = useMemo(
    () => getWalletSetting(SETTINGS.RIF_WALLET_SERVICE_URL),
    [],
  )

  const goToChangeLanguage = () => navigation.navigate('ChangeLanguage')

  const goToAccountsScreen = () => navigation.navigate('AccountsScreen')

  const goToSecurityConfiguration = () =>
    navigation.navigate('SecurityConfigurationScreen')

  const goToDeploy = () => navigation.navigate('ManuallyDeployScreen')

  const goToFeedbackScreen = () => navigation.navigate('FeedbackScreen')

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mainView}>
        <TouchableOpacity
          accessibilityLabel="language"
          onPress={goToChangeLanguage}
          style={styles.rowComponent}>
          <DiscoverTuneIcon width={18} height={18} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            General
          </SemiBoldText>
        </TouchableOpacity>
        {/* @TODO add link to go to the accounts screen */}
        <TouchableOpacity
          accessibilityLabel="account"
          style={styles.rowComponent}
          onPress={goToAccountsScreen}>
          <AccountsIcon width={18} height={18} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Account
          </SemiBoldText>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="security"
          style={styles.rowComponent}
          onPress={goToSecurityConfiguration}>
          <LockIcon />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Security
          </SemiBoldText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.rowComponent}
          onPress={goToDeploy}
          accessibilityLabel="deploy">
          <Icon name="wallet-outline" color={colors.white} size={20} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Smart Wallet Deploy
          </SemiBoldText>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityLabel="feedback"
          style={styles.rowComponent}
          onPress={goToFeedbackScreen}>
          <FontAwesomeIcon name="comment" color={colors.white} size={20} />
          <SemiBoldText style={[styles.textColor, spacing.ml6]}>
            Feedback
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
