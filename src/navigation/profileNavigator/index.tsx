import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { AppTouchable, Typography } from 'components/index'
import { ProfileCreateScreen, ShareProfileScreen } from 'screens/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { InjectedScreens } from 'src/core/Core'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import { ProfileStackParamsList, profileStackRouteNames } from './types'

const ProfileStack = createStackNavigator<ProfileStackParamsList>()

export const headerLeftOption = (onBackPress: () => void) => (
  <AppTouchable
    width={20}
    onPress={onBackPress}
    style={sharedStyles.marginLeft24}>
    <Icon
      name={'chevron-left'}
      size={20}
      color={sharedColors.white}
      style={headerStyles.headerPosition}
    />
  </AppTouchable>
)

const screenOptionsWithHeader = (title: string): StackNavigationOptions => ({
  headerShown: true,
  headerTitle: props => (
    <Typography type={'h3'} style={headerStyles.headerPosition}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: headerStyles.headerStyle,
  headerShadowVisible: false,
})

const noHeader: StackNavigationOptions = {
  headerShown: false,
}

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
      <ProfileStack.Screen
        name={profileStackRouteNames.CongratulationsScreen}
        component={InjectedScreens.CongratulationsScreen}
        options={noHeader}
      />
    </ProfileStack.Navigator>
  )
}

export const headerStyles = StyleSheet.create({
  headerPosition: castStyle.view({
    marginTop: -45,
  }),
  headerStyle: castStyle.view({
    backgroundColor: sharedColors.primary,
    height: 55,
  }),
})
