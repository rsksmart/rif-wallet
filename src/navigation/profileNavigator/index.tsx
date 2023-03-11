import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'
import { StyleSheet, Platform } from 'react-native'
import { useEffect } from 'react'

import { InjectedScreens } from 'src/core/Core'
import { ProfileCreateScreen, ShareProfileScreen } from 'screens/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { Typography, AppTouchable } from 'components/index'
import { castStyle } from 'shared/utils'


import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { ProfileStackParamsList, profileStackRouteNames } from './types'

const ProfileStack = createStackNavigator<ProfileStackParamsList>()

export const headerLeftOption = (goBack: () => void) => (
  <AppTouchable width={20} onPress={goBack} style={sharedStyles.marginLeft24}>
    <Icon
      name={'chevron-left'}
      size={20}
      color={sharedColors.white}
      style={headerStyles.headerPosition}
    />
  </AppTouchable>
)

const screenOptionsWithHeader = (
  title: string,
): StackNavigationOptions => ({
  headerShown: true,
  headerTitle: props => (
    <Typography type={'h3'} style={headerStyles.headerPosition}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: headerStyles.headerStyle,
  headerTitleAlign: 'center',
  headerShadowVisible: false,
})

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])
  const { t } = useTranslation()

  return (
    <ProfileStack.Navigator>
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
        options={screenOptionsWithHeader(t('username_registration_title'))}
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

export const headerStyles = StyleSheet.create({
  headerPosition: castStyle.view({
    marginTop: Platform.OS === 'ios' ? -45 : 0,
  }),
  headerStyle: castStyle.view({
    backgroundColor: sharedColors.primary,
    height: 55,
  }),
})
