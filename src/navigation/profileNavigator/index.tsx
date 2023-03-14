import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { AppTouchable, Typography } from 'components/index'
import { InjectedScreens } from 'core/Core'
import { ProfileCreateScreen, ShareProfileScreen } from 'screens/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { selectProfile } from 'src/redux/slices/profileSlice'
import { useAppSelector } from 'src/redux/storeUtils'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import {
  ProfileStackParamsList,
  profileStackRouteNames,
  ProfileStatus,
} from './types'

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

export const screenOptionsWithHeader = (
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
  const profile = useAppSelector(selectProfile)

  return (
    <ProfileStack.Navigator>
      {profile.status !== ProfileStatus.READY_TO_PURCHASE && (
        <ProfileStack.Screen
          name={profileStackRouteNames.ProfileCreateScreen}
          component={ProfileCreateScreen}
          options={screenOptionsWithHeader(t('profile_screen_title'))}
        />
      )}

      {(profile.status === ProfileStatus.NONE ||
        profile.status === ProfileStatus.REQUESTING_ERROR) && (
        <ProfileStack.Screen
          name={profileStackRouteNames.SearchDomain}
          component={InjectedScreens.SearchDomainScreen}
          options={screenOptionsWithHeader(t('username_registration_title'))}
        />
      )}

      {profile.status === ProfileStatus.REQUESTING && (
        <ProfileStack.Screen
          name={profileStackRouteNames.BuyDomain}
          component={InjectedScreens.BuyDomainScreen}
          initialParams={{ alias: profile.alias }}
        />
      )}

      <ProfileStack.Screen
        name={profileStackRouteNames.AliasBought}
        component={InjectedScreens.AliasBoughtScreen}
      />

      <ProfileStack.Screen
        name={profileStackRouteNames.ShareProfileScreen}
        component={ShareProfileScreen}
        options={screenOptionsWithHeader(t('profile_screen_title'))}
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
  }),
})
