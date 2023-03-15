import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { AppTouchable, Typography } from 'components/index'
import { InjectedScreens } from 'core/Core'
import {
  ProfileCreateScreen,
  PurchaseDomainScreen,
  ShareProfileScreen,
} from 'screens/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { selectProfileStatus } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

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

const screenOptionsWithHeader = (
  title: string,
  style?: StyleProp<ViewStyle>,
): StackNavigationOptions => ({
  headerShown: true,
  headerTitle: props => (
    <Typography type={'h3'} style={headerStyles.headerPosition}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: [
    headerStyles.headerStyle,
    { backgroundColor: sharedColors.secondary },
    style,
  ],
  headerTitleAlign: 'center',
  headerShadowVisible: false,
})

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])
  const { t } = useTranslation()
  const status = useAppSelector(selectProfileStatus)

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileCreateScreen}
        component={ProfileCreateScreen}
        options={screenOptionsWithHeader(t('profile_screen_title'), {
          backgroundColor: sharedColors.primary,
        })}
      />

      <ProfileStack.Screen
        name={profileStackRouteNames.SearchDomain}
        component={InjectedScreens.SearchDomainScreen}
        options={screenOptionsWithHeader(t('username_registration_title'))}
      />

      {status === ProfileStatus.READY_TO_PURCHASE && (
        <ProfileStack.Screen
          name={profileStackRouteNames.PurchaseDomain}
          component={PurchaseDomainScreen}
          options={screenOptionsWithHeader(t('username_registration_title'))}
        />
      )}

      {/* <ProfileStack.Screen
        name={profileStackRouteNames.AliasBought}
        component={InjectedScreens.AliasBoughtScreen}
      /> */}

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
