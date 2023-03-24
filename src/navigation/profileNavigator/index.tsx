import {
  createStackNavigator,
  StackNavigationOptions,
} from '@react-navigation/stack'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleProp, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { useProfileStatusColors } from 'lib/rns'

import { AppTouchable, Typography } from 'components/index'
import { StepperComponent } from 'components/profile'
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
    <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
  </AppTouchable>
)

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  const { t } = useTranslation()
  const status = useAppSelector(selectProfileStatus)
  const { startColor, endColor } = useProfileStatusColors()

  const screenOptionsWithHeader = (
    title: string,
    showStepper = true,
    style?: StyleProp<ViewStyle>,
  ): StackNavigationOptions => ({
    headerShown: true,
    headerTitle: props => (
      <>
        <Typography type="h3" style={headerStyles.title}>
          {title ?? props.children}
        </Typography>
        {showStepper && (
          <StepperComponent
            colors={[startColor, endColor]}
            width={40}
            style={headerStyles.stepper}
          />
        )}
      </>
    ),
    headerStyle: [
      headerStyles.headerStyle,
      { backgroundColor: sharedColors.secondary },
      style,
    ],
    headerTitleAlign: 'center',
    headerShadowVisible: false,
  })

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <ProfileStack.Navigator>
      {status === ProfileStatus.READY_TO_PURCHASE && (
        <ProfileStack.Screen
          name={profileStackRouteNames.PurchaseDomain}
          component={PurchaseDomainScreen}
          options={screenOptionsWithHeader(t('username_registration_title'))}
        />
      )}

      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileCreateScreen}
        component={ProfileCreateScreen}
        options={screenOptionsWithHeader(t('profile_screen_title'), false, {
          backgroundColor: sharedColors.primary,
        })}
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
  headerStyle: castStyle.view({
    backgroundColor: sharedColors.primary,
    height: 100,
  }),
  title: castStyle.text({
    marginTop: 20,
  }),
  stepper: castStyle.view({
    marginTop: 10,
    alignSelf: 'center',
  }),
})
