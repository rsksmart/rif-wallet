import { createStackNavigator } from '@react-navigation/stack'

import {
  CreateKeysScreen,
  NewMasterKeyScreen,
  ConfirmNewMasterKeyScreen,
  ImportMasterKeyScreen,
  SecurityExplanationScreen,
  SecureYourWalletScreen,
} from 'screens/createKeys'
import { selectIsUnlocked } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { CreateKeysStackParamList, createKeysRouteNames } from './types'

const Stack = createStackNavigator<CreateKeysStackParamList>()

const screensOptions = { headerShown: false }

export const CreateKeysNavigation = () => {
  const unlocked = useAppSelector(selectIsUnlocked)

  return (
    <Stack.Navigator initialRouteName={createKeysRouteNames.CreateKeys}>
      {!unlocked ? (
        <Stack.Screen
          name={createKeysRouteNames.CreateKeys}
          component={CreateKeysScreen}
          options={screensOptions}
        />
      ) : null}
      <Stack.Screen
        name={createKeysRouteNames.NewMasterKey}
        component={NewMasterKeyScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name={createKeysRouteNames.SecureYourWallet}
        component={SecureYourWalletScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name={createKeysRouteNames.SecurityExplanation}
        component={SecurityExplanationScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name={createKeysRouteNames.ConfirmNewMasterKey}
        component={ConfirmNewMasterKeyScreen}
        options={screensOptions}
      />
      <Stack.Screen
        name={createKeysRouteNames.ImportMasterKey}
        component={ImportMasterKeyScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}

export * from './types'
