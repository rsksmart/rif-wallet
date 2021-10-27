import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import CreateWalletScreen from './CreateWalletScreen'
import CreateMasterKeyScreen from './create/CreateMasterKeyScreen'
import ConfirmMasterKeyScreen from './create/ConfirmMasterKeyScreen'
import WalletCreatedScreen from './WalletCreatedScreen'
import ImportMasterKeyScreen from './import/ImportMasterKeyScreen'
import RevealMasterKeyScreen from './RevealMasterKeyScreen'

const Stack = createStackNavigator()

const screensOptions = { headerShown: false }

const CreateWalletNavigationScreen: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="CreateWallet">
      <Stack.Screen
        name="CreateWallet"
        component={CreateWalletScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="CreateMasterKey"
        component={CreateMasterKeyScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="ConfirmMasterKey"
        component={ConfirmMasterKeyScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="WalletCreated"
        component={WalletCreatedScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name="ImportWallet"
        component={ImportMasterKeyScreen}
        options={screensOptions}
      />
      <Stack.Screen name="RevealMasterKey" component={RevealMasterKeyScreen} options={screensOptions} />
    </Stack.Navigator>
  )
}

export default CreateWalletNavigationScreen
