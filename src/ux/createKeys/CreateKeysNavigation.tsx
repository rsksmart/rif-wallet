import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import { CreateKeysScreen } from './CreateKeysScreen'
import { NewMasterKeyScreen } from './new/NewMasterKeyScreen'
import { ConfirmNewMasterKeyScreen } from './new/ConfirmNewMasterKeyScreen'
import { ImportMasterKeyScreen } from './import/ImportMasterKeyScreen'
import { KeysCreatedScreen } from './KeysCreatedScreen'
import { StackParamList, CreateKeysProps } from './types'

const Stack = createStackNavigator<StackParamList>()

const screensOptions = { headerShown: false }

export const CreateKeysNavigation: React.FC<CreateKeysProps> = ({
  generateMnemonic,
  createFirstWallet,
}) => {
  return (
    <Stack.Navigator initialRouteName="CreateKeys">
      <Stack.Screen
        name="CreateKeys"
        component={CreateKeysScreen}
        options={screensOptions}
      />
      <Stack.Group>
        <Stack.Group>
          <Stack.Screen name="NewMasterKey" options={screensOptions}>
            {props => (
              <NewMasterKeyScreen
                {...props}
                generateMnemonic={generateMnemonic}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="ConfirmNewMasterKey" options={screensOptions}>
            {props => (
              <ConfirmNewMasterKeyScreen
                {...props}
                createFirstWallet={createFirstWallet}
              />
            )}
          </Stack.Screen>
        </Stack.Group>
        <Stack.Screen name="ImportMasterKey" options={screensOptions}>
          {props => (
            <ImportMasterKeyScreen
              {...props}
              createFirstWallet={createFirstWallet}
            />
          )}
        </Stack.Screen>
      </Stack.Group>
      <Stack.Screen
        name="KeysCreated"
        component={KeysCreatedScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}
