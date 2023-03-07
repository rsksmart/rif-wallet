import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'

import { useEffect } from 'react'
import { InjectedScreens } from 'src/core/Core'
import { ProfileCreateScreen, ShareProfileScreen } from 'screens/index'
import { AppHeader } from 'src/ux/appHeader'
import { sharedColors, sharedStyles } from 'shared/constants'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { Typography, AppTouchable } from 'components/index'

import { ProfileStackParamsList, profileStackRouteNames } from './types'
/*import { screenOptionsWithHeader } from 'navigation/createKeysNavigator'*/

const ProfileStack = createStackNavigator<ProfileStackParamsList>()

const screenOptionsWithHeader = (title?: string): StackNavigationOptions => ({
  headerShown: true,
  headerLeft: props => (
    <AppTouchable
      width={20}
      onPress={props.onPress}
      style={sharedStyles.marginLeft24}>
      <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
    </AppTouchable>
  ),
  headerTitle: props => (
    <Typography type={'h3'}>{title ?? props.children}</Typography>
  ),
  headerStyle: {
    height: 64,
    backgroundColor: sharedColors.black,
  },
  headerShadowVisible: false,
})

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])
  const { t } = useTranslation()

  return (
    <ProfileStack.Navigator
      screenOptions={{
        header: props => <AppHeader isShown={true} {...props} />,
      }}>
      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileCreateScreen}
        component={ProfileCreateScreen}
        options={screenOptionsWithHeader(t('profile_screen_title'))}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.ShareProfileScreen}
        component={ShareProfileScreen}
        options={screenOptionsWithHeader(t('profile_screen_title'))}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.SearchDomain}
        component={InjectedScreens.SearchDomainScreen}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.RequestDomain}
        component={InjectedScreens.RequestDomainScreen}
      />

      <ProfileStack.Screen
        name={profileStackRouteNames.BuyDomain}
        component={InjectedScreens.BuyDomainScreen}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.AliasBought}
        component={InjectedScreens.AliasBoughtScreen}
      />
    </ProfileStack.Navigator>
  )
}
