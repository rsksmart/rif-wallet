import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'

import {
  CreateKeysScreen,
  NewMasterKeyScreen,
  ConfirmNewMasterKeyScreen,
  ImportMasterKeyScreen,
  SecurityExplanationScreen,
  SecureYourWalletScreen,
} from 'screens/createKeys'
import { Typography, AppTouchable } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { selectIsUnlocked } from 'store/slices/settingsSlice'
import { useAppSelector } from 'store/storeUtils'
import { CreateKeysStackParamList, createKeysRouteNames } from './types'

const Stack = createStackNavigator<CreateKeysStackParamList>()

const screensOptions = { headerShown: false }

const screenOptionsWithHeader: StackNavigationOptions = {
  headerShown: true,
  headerLeft: props => (
    <AppTouchable
      width={20}
      onPress={props.onPress}
      style={sharedStyles.marginLeft24}>
      <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
    </AppTouchable>
  ),
  headerTitle: () => <Typography type={'h3'}>{'Wallet backup'}</Typography>,
  headerStyle: {
    height: 64,
    backgroundColor: sharedColors.black,
  },
  headerShadowVisible: false,
}

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
        options={screenOptionsWithHeader}
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
