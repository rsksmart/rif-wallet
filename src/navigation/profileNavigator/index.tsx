import { createStackNavigator } from '@react-navigation/stack'
import { useEffect } from 'react'
import { InjectedScreens } from 'src/core/Core'
import { ProfileCreateScreen, ProfileDetailsScreen } from 'src/screens'
import { AppHeader } from 'src/ux/appHeader'
import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { ProfileStackParamsList, profileStackRouteNames } from './types'

const ProfileStack = createStackNavigator<ProfileStackParamsList>()

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <ProfileStack.Navigator
      screenOptions={{ header: props => <AppHeader {...props} /> }}>
      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileCreateScreen}
        component={ProfileCreateScreen}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileDetailsScreen}
        component={ProfileDetailsScreen}
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
      <ProfileStack.Screen
        name={profileStackRouteNames.RegisterDomain}
        component={InjectedScreens.RegisterDomainScreen}
      />
    </ProfileStack.Navigator>
  )
}
