import { NavigationProp as _NavigationProp } from '@react-navigation/native'
import { createStackNavigator, StackScreenProps } from '@react-navigation/stack'
import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { InjectSelectedWallet } from './Context'
import { IRifWalletServicesSocket } from './lib/rifWalletServices/RifWalletServicesSocket'
import * as Screens from './screens'
import BitcoinAddressesScreen from './screens/bitcoin/BitcoinAddressesScreen'
import { CreateKeysNavigation, CreateKeysProps } from './screens/createKeys'
import { colors } from './styles'
import { AppFooterMenu } from './ux/appFooter'
import { AppHeader } from './ux/appHeader'

import { emptyProfile, useProfile } from './core/hooks/useProfile'

const InjectedScreens = {
  SendScreen: InjectSelectedWallet(Screens.SendScreen),
  BalancesScreen: InjectSelectedWallet(Screens.BalancesScreen),
  ActivityScreen: InjectSelectedWallet(Screens.ActivityScreen),
  ActivityDetailsScreen: InjectSelectedWallet(Screens.ActivityDetailsScreen),
  ManuallyDeployScreen: InjectSelectedWallet(Screens.ManuallyDeployScreen),
  WalletConnectScreen: InjectSelectedWallet(Screens.WalletConnectScreen),
  RNSManagerScreen: InjectSelectedWallet(Screens.RNSManagerScreen),
  SearchDomainScreen: InjectSelectedWallet(Screens.SearchDomainScreen),
  RegisterDomainScreen: InjectSelectedWallet(Screens.RegisterDomainScreen),
  HomeScreen: InjectSelectedWallet(Screens.HomeScreen),
  AccountsScreen: InjectSelectedWallet(Screens.AccountsScreen),
}

type RootStackParamList = {
  Home: undefined
  Send:
    | undefined
    | {
        token?: string
        to?: string
        displayTo?: string
        contractAddress?: string
      }
  Receive: undefined
  Balances: undefined
  Activity: undefined
  ActivityDetails: undefined
  SignMessage: undefined
  SignTypedData: undefined
  TransactionReceived: undefined
  ManuallyDeployScreen: undefined
  CreateKeysUX: undefined
  ShowMnemonicScreen: undefined
  WalletConnect: undefined | { wcKey?: string }
  ChangeLanguage: undefined
  ManagePin: undefined
  CreatePin: undefined
  RNSManager: undefined
  SearchDomain: undefined
  RegisterDomain: { selectedDomain: string; years: number }
  Contacts: undefined
  Settings: undefined
  EventsScreen: undefined
  AccountsScreen: undefined
  SecurityConfigurationScreen: undefined
  ProfileCreateScreen: undefined
  ProfileDetailsScreen: undefined
  ChangePinScreen: undefined
  BitcoinScreen: undefined
}

const RootStack = createStackNavigator<RootStackParamList>()
export type NavigationProp = _NavigationProp<RootStackParamList>

const sharedOptions = {
  headerShown: false,
  cardStyle: {
    backgroundColor: colors.blue,
  },
}

export type ScreenProps<T extends keyof RootStackParamList> = StackScreenProps<
  RootStackParamList,
  T
>

export const RootNavigation: React.FC<{
  currentScreen: string
  hasKeys: boolean
  hasPin: boolean
  isKeyboardVisible: boolean
  changeTopColor: (color: string) => void
  rifWalletServicesSocket: IRifWalletServicesSocket
  keyManagementProps: CreateKeysProps
  createPin: (newPin: string) => Promise<void>
  editPin: (newPin: string) => Promise<void>
  setWalletIsDeployed: (address: string, value?: boolean) => void
  balancesScreenProps: Screens.BalancesScreenProps
  activityScreenProps: Screens.ActivityScreenProps
  showMnemonicScreenProps: Screens.ShowMnemonicScreenProps
  sendScreenProps: ScreenProps<'Send'>
  contactsNavigationScreenProps: Screens.ContactsScreenProps
  walletConnectScreenProps: ScreenProps<'WalletConnect'>
  accountsScreenType: Screens.AccountsScreenType
  securityConfigurationScreenProps: Screens.SecurityScreenProps
}> = ({
  currentScreen,
  hasKeys,
  hasPin,
  isKeyboardVisible,
  changeTopColor,
  keyManagementProps,
  createPin,
  editPin,
  balancesScreenProps,
  activityScreenProps,
  showMnemonicScreenProps,
  sendScreenProps,
  contactsNavigationScreenProps,
  walletConnectScreenProps,
  accountsScreenType,
  securityConfigurationScreenProps,
  setWalletIsDeployed,
}) => {
  const { profile, setProfile, storeProfile, eraseProfile, profileCreated } =
    useProfile(emptyProfile)

  let initialRoute: any = 'CreateKeysUX'
  if (hasPin) {
    initialRoute = 'Home'
  } else if (hasKeys) {
    initialRoute = 'CreatePin'
  }

  const appIsSetup = hasKeys && hasPin

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.parent}>
        {appIsSetup && (
          <AppHeader profile={profile} profileCreated={profileCreated} />
        )}
        <RootStack.Navigator initialRouteName={initialRoute}>
          <RootStack.Screen name="Home" options={sharedOptions}>
            {props => (
              <InjectedScreens.HomeScreen
                {...props}
                changeTopColor={changeTopColor}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="WalletConnect" options={sharedOptions}>
            {props => (
              <InjectedScreens.WalletConnectScreen
                {...props}
                {...walletConnectScreenProps}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="Settings" options={sharedOptions}>
            {props => <Screens.SettingsScreen {...props} />}
          </RootStack.Screen>
          <RootStack.Screen name="CreateKeysUX" options={sharedOptions}>
            {props => (
              <CreateKeysNavigation
                {...props}
                {...keyManagementProps}
                isKeyboardVisible={isKeyboardVisible}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            component={Screens.ReceiveScreenHOC}
            name="Receive"
            options={sharedOptions}
          />
          <RootStack.Screen name="Send" options={sharedOptions}>
            {props => (
              <InjectedScreens.SendScreen {...props} {...sendScreenProps} />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="BitcoinScreen"
            options={sharedOptions}
            component={BitcoinAddressesScreen}
          />
          <RootStack.Screen name="Balances">
            {props => (
              <InjectedScreens.BalancesScreen
                {...props}
                {...balancesScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="Activity" options={sharedOptions}>
            {props => (
              <InjectedScreens.ActivityScreen
                {...props}
                {...activityScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="ActivityDetails"
            component={InjectedScreens.ActivityDetailsScreen}
            options={sharedOptions}
          />
          <RootStack.Screen name="ManuallyDeployScreen" options={sharedOptions}>
            {props => (
              <InjectedScreens.ManuallyDeployScreen
                {...props}
                setWalletIsDeployed={setWalletIsDeployed}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="AccountsScreen" options={sharedOptions}>
            {props => (
              <InjectedScreens.AccountsScreen
                {...props}
                {...accountsScreenType}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ShowMnemonicScreen" options={sharedOptions}>
            {props => (
              <Screens.ShowMnemonicScreen
                {...props}
                {...showMnemonicScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="RNSManager" options={sharedOptions}>
            {props => (
              <InjectedScreens.RNSManagerScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen name="SearchDomain" options={sharedOptions}>
            {props => (
              <InjectedScreens.SearchDomainScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
              />
            )}
          </RootStack.Screen>

          <RootStack.Screen
            name="RegisterDomain"
            component={InjectedScreens.RegisterDomainScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="ChangeLanguage"
            component={Screens.ChangeLanguageScreen}
            options={sharedOptions}
          />

          <RootStack.Screen name="CreatePin" options={sharedOptions}>
            {props => (
              <Screens.CreatePinScreen {...props} createPin={createPin} />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ChangePinScreen" options={sharedOptions}>
            {props => <Screens.ChangePinScreen {...props} editPin={editPin} />}
          </RootStack.Screen>
          <RootStack.Screen name="Contacts" options={sharedOptions}>
            {props => (
              <Screens.ContactsNavigationScreen
                {...props}
                {...contactsNavigationScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen
            name="EventsScreen"
            component={Screens.EventsScreen}
            options={sharedOptions}
          />
          <RootStack.Screen
            name="SecurityConfigurationScreen"
            options={sharedOptions}>
            {props => (
              <Screens.SecurityConfigurationScreen
                {...props}
                {...securityConfigurationScreenProps}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ProfileCreateScreen" options={sharedOptions}>
            {props => (
              <Screens.ProfileCreateScreen
                {...props}
                profile={profile}
                setProfile={setProfile}
                storeProfile={storeProfile}
                eraseProfile={eraseProfile}
              />
            )}
          </RootStack.Screen>
          <RootStack.Screen name="ProfileDetailsScreen" options={sharedOptions}>
            {props => (
              <Screens.ProfileDetailsScreen {...props} profile={profile} />
            )}
          </RootStack.Screen>
        </RootStack.Navigator>
        {appIsSetup && !isKeyboardVisible && (
          <AppFooterMenu currentScreen={currentScreen} />
        )}
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
  },
})
