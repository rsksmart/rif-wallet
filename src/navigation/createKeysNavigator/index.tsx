import { createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
import { PinScreen } from 'screens/pinScreen'
import { SeendlessOnboarding } from 'src/screens/seedless'

import { CreateKeysStackParamList, createKeysRouteNames } from './types'
import { screenOptionsWithHeader } from '..'

const Stack = createStackNavigator<CreateKeysStackParamList>()

const screensOptions = { headerShown: false }

export const CreateKeysNavigation = () => {
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()
  const unlocked = useAppSelector(selectIsUnlocked)

  return (
    <Stack.Navigator initialRouteName={createKeysRouteNames.CreateKeys}>
      {!unlocked ? (
        <Stack.Group screenOptions={screensOptions}>
          <Stack.Screen
            name={createKeysRouteNames.CreateKeys}
            component={CreateKeysScreen}
          />
          <Stack.Screen
            name={createKeysRouteNames.SeendlessOnboarding}
            component={SeendlessOnboarding}
            options={screenOptionsWithHeader(top, '')}
          />
        </Stack.Group>
      ) : null}
      <Stack.Screen
        name={createKeysRouteNames.NewMasterKey}
        component={NewMasterKeyScreen}
        options={screenOptionsWithHeader(top, t('confirm_key_screen_title'))}
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
        options={screenOptionsWithHeader(top, t('confirm_key_screen_title'))}
      />
      <Stack.Screen
        name={createKeysRouteNames.ImportMasterKey}
        component={ImportMasterKeyScreen}
        options={screenOptionsWithHeader(top, t('header_import_wallet'))}
      />
      <Stack.Screen
        name={createKeysRouteNames.CreatePIN}
        component={PinScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}

export * from './types'
