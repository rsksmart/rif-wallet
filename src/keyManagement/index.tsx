import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import CreateKeysScreen from './create/CreateKeysScreen'
import NewMasterKeyScreen from './create/new/NewMasterKeyScreen'
import ConfirmNewMasterKeyScreen from './create/new/ConfirmNewMasterKeyScreen'
import ImportMasterKeyScreen from './create/import/ImportMasterKeyScreen'
import KeysCreatedScreen from './create/KeysCreatedScreen'
import RevealMasterKeyScreen from './info/RevealMasterKeyScreen'
import { StackParamList, KeyManagementProps } from './types'

const Stack = createStackNavigator<StackParamList>()

const screensOptions = { headerShown: false }

const KeyManagement: React.FC<KeyManagementProps> = ({
  generateMnemonic, createFirstWallet, mnemonic
}) => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen name="CreateKeys" component={CreateKeysScreen} options={screensOptions} />
        <Stack.Group>
          <Stack.Group>
            <Stack.Screen name="NewMasterKey" options={screensOptions}>
              {props => <NewMasterKeyScreen {...props} generateMnemonic={generateMnemonic} />}
            </Stack.Screen>
            <Stack.Screen name="ConfirmNewMasterKey" options={screensOptions}>
              {props => <ConfirmNewMasterKeyScreen {...props} createFirstWallet={createFirstWallet} />}
            </Stack.Screen>
          </Stack.Group>
            <Stack.Screen name="ImportMasterKey" options={screensOptions}>
              {props => <ImportMasterKeyScreen {...props} createFirstWallet={createFirstWallet} />}
            </Stack.Screen>
        </Stack.Group>
        <Stack.Screen name="KeysCreated" component={KeysCreatedScreen} options={screensOptions}/>
      </Stack.Group>
      <Stack.Screen name="RevealMasterKey" options={screensOptions}>
        {props => <RevealMasterKeyScreen {...props} mnemonic={mnemonic} />}
      </Stack.Screen>
    </Stack.Navigator>
  )
}

export default KeyManagement
