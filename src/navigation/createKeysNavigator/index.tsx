import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { CreateKeysScreen } from '../../screens/createKeys/CreateKeysScreen'
import { NewMasterKeyScreen } from '../../screens/createKeys/new/NewMasterKeyScreen'
import { ConfirmNewMasterKeyScreen } from '../../screens/createKeys/new/ConfirmNewMasterKeyScreen'
import { ImportMasterKeyScreen } from '../../screens/createKeys/import/ImportMasterKeyScreen'
import {
  CreateKeysStackParamList,
  CreateKeysProps,
  createKeysRouteNames,
} from './types'
import { SecurityExplanationScreen } from '../../screens/createKeys/SecurityExplanationScreen'
import { SecureYourWalletScreen } from '../../screens/createKeys/SecureYourWalletScreen'

const Stack = createStackNavigator<CreateKeysStackParamList>()

const screensOptions = { headerShown: false }

export const CreateKeysNavigation = ({
  generateMnemonic,
  createFirstWallet,
  isKeyboardVisible,
}: CreateKeysProps) => {
  const createWallet = (mnemonic: string) => createFirstWallet(mnemonic)

  return (
    <Stack.Navigator initialRouteName={createKeysRouteNames.CreateKeys}>
      <Stack.Screen
        name={createKeysRouteNames.CreateKeys}
        component={CreateKeysScreen}
        options={screensOptions}
      />
      <Stack.Group>
        <Stack.Group>
          <Stack.Screen
            name={createKeysRouteNames.NewMasterKey}
            options={screensOptions}>
            {props => (
              <NewMasterKeyScreen
                {...props}
                generateMnemonic={generateMnemonic}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name={createKeysRouteNames.SecureYourWallet}
            options={screensOptions}>
            {props => (
              <SecureYourWalletScreen
                {...props}
                mnemonic={generateMnemonic()}
                createWallet={createWallet}
              />
            )}
          </Stack.Screen>
          <Stack.Screen
            name={createKeysRouteNames.SecurityExplanation}
            options={screensOptions}
            component={SecurityExplanationScreen}
          />
          <Stack.Screen
            name={createKeysRouteNames.ConfirmNewMasterKey}
            options={screensOptions}>
            {props => (
              <ConfirmNewMasterKeyScreen
                {...props}
                createWallet={createWallet}
                isKeyboardVisible={isKeyboardVisible}
              />
            )}
          </Stack.Screen>
        </Stack.Group>
        <Stack.Screen
          name={createKeysRouteNames.ImportMasterKey}
          options={screensOptions}>
          {props => (
            <ImportMasterKeyScreen
              {...props}
              createWallet={createWallet}
              isKeyboardVisible={isKeyboardVisible}
            />
          )}
        </Stack.Screen>
      </Stack.Group>
    </Stack.Navigator>
  )
}
