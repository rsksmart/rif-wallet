import { createStackNavigator } from '@react-navigation/stack'
import { useTranslation } from 'react-i18next'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import {
  CreateKeysScreen,
  NewMasterKeyScreen,
  ConfirmNewMasterKeyScreen,
  ImportMasterKeyScreen,
  SecurityInformation,
  RetryLogin,
} from 'screens/createKeys'
import { selectKeysExist } from 'store/slices/persistentDataSlice'
import { useAppSelector } from 'store/storeUtils'
import { PinScreen } from 'screens/pinScreen'

import { CreateKeysStackParamList, createKeysRouteNames } from './types'
import { screenOptionsWithHeader } from '..'

const Stack = createStackNavigator<CreateKeysStackParamList>()

const screensOptions = { headerShown: false }

export const CreateKeysNavigation = () => {
  const keysExist = useAppSelector(selectKeysExist)
  const { top } = useSafeAreaInsets()
  const { t } = useTranslation()

  return (
    <Stack.Navigator initialRouteName={createKeysRouteNames.CreateKeys}>
      {!keysExist ? (
        <Stack.Screen
          name={createKeysRouteNames.CreateKeys}
          component={CreateKeysScreen}
          options={screensOptions}
        />
      ) : (
        <Stack.Screen
          name={createKeysRouteNames.RetryLogin}
          component={RetryLogin}
          options={screensOptions}
        />
      )}
      <Stack.Screen
        name={createKeysRouteNames.NewMasterKey}
        component={NewMasterKeyScreen}
        options={screenOptionsWithHeader(top, t('confirm_key_screen_title'))}
      />
      <Stack.Screen
        name={createKeysRouteNames.SecurityInformation}
        component={SecurityInformation}
        options={screenOptionsWithHeader(top, '')}
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
        name={createKeysRouteNames.PinScreen}
        component={PinScreen}
        options={screensOptions}
      />
    </Stack.Navigator>
  )
}

export * from './types'
