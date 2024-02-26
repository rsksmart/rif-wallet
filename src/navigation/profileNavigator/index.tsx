import { createStackNavigator } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { useProfileStatusColors } from 'lib/rns'

import { AppTouchable } from 'components/appTouchable'
import {
  AliasBoughtScreen,
  ProfileCreateScreen,
  PurchaseDomainScreen,
  SearchDomainScreen,
  ShareProfileScreen,
} from 'screens/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { selectProfileStatus } from 'store/slices/profileSlice'
import { useAppSelector } from 'store/storeUtils'

import { rootTabsRouteNames, RootTabsScreenProps } from '../rootNavigator'
import {
  ProfileStackParamsList,
  profileStackRouteNames,
  ProfileStatus,
} from './types'
import { screenOptionsWithHeader } from '..'

const ProfileStack = createStackNavigator<ProfileStackParamsList>()

export const headerLeftOption = (goBack: () => void) => (
  <AppTouchable width={20} onPress={goBack} style={sharedStyles.marginLeft24}>
    <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
  </AppTouchable>
)

export const ProfileNavigator = ({
  navigation,
}: RootTabsScreenProps<rootTabsRouteNames.Profile>) => {
  const { top } = useSafeAreaInsets()

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    })
  }, [navigation])
  const { t } = useTranslation()
  const status = useAppSelector(selectProfileStatus)
  const { startColor, endColor } = useProfileStatusColors()

  useEffect(() => {
    navigation.setOptions({ headerShown: false })
  }, [navigation])

  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen
        name={profileStackRouteNames.ProfileCreateScreen}
        component={ProfileCreateScreen}
        options={screenOptionsWithHeader(
          top,
          t('profile_screen_title'),
          sharedColors.primary,
        )}
      />
      <ProfileStack.Screen
        name={profileStackRouteNames.ShareProfileScreen}
        component={ShareProfileScreen}
        options={screenOptionsWithHeader(
          top,
          t('profile_screen_title'),
          undefined,
          [startColor, endColor],
        )}
      />

      {status < ProfileStatus.READY_TO_PURCHASE && (
        <ProfileStack.Screen
          name={profileStackRouteNames.SearchDomain}
          component={SearchDomainScreen}
          options={screenOptionsWithHeader(
            top,
            t('username_registration_title'),
            undefined,
            [startColor, endColor],
          )}
        />
      )}

      {status >= ProfileStatus.READY_TO_PURCHASE && (
        <ProfileStack.Screen
          name={profileStackRouteNames.PurchaseDomain}
          component={PurchaseDomainScreen}
          options={screenOptionsWithHeader(
            top,
            t('username_registration_title'),
            undefined,
            [startColor, endColor],
          )}
        />
      )}

      <ProfileStack.Screen
        name={profileStackRouteNames.AliasBought}
        component={AliasBoughtScreen}
        options={{ headerShown: false }}
      />
    </ProfileStack.Navigator>
  )
}
