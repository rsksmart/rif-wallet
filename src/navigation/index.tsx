import { ColorValue, StyleSheet, View } from 'react-native'
import { StackNavigationOptions } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs'

import { AppTouchable, Typography } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'
import { AppHeader } from 'src/ux/appHeader'
import { StepperComponent } from 'components/profile'
import { castStyle } from 'shared/utils'

type HeaderProps = BottomTabNavigationOptions & StackNavigationOptions

export const screenOptionsNoHeader: HeaderProps = { headerShown: false }

export const sharedHeaderLeftOptions = (goBack?: () => void) => (
  <AppTouchable
    width={20}
    onPress={goBack}
    style={sharedStyles.marginLeft24}
    accessibilityLabel="backButton">
    <Icon name={'chevron-left'} size={20} color={sharedColors.white} />
  </AppTouchable>
)

export const screenOptionsWithHeader = (
  topInset: number,
  title?: string,
  color?: ColorValue,
  stepper?: ColorValue[],
  backButtonDisabled?: boolean,
  goBack?: () => void,
): HeaderProps => {
  return {
    headerShown: true,
    headerLeft: props =>
      backButtonDisabled
        ? null
        : sharedHeaderLeftOptions(
            goBack ?? ('onPress' in props ? props.onPress : undefined),
          ),
    headerTitle: props => (
      <View style={sharedStyles.contentCenter}>
        <Typography type={'h3'} style={props.style}>
          {title ?? props.children}
        </Typography>
        {stepper && (
          <StepperComponent
            colors={stepper}
            width={40}
            style={headerStyles.stepper}
          />
        )}
      </View>
    ),
    headerStyle: {
      height: 64 + topInset,
      backgroundColor: color || sharedColors.background.primary,
    },
    headerShadowVisible: false,
  }
}

export const screenOptionsWithAppHeader: HeaderProps = {
  headerShown: true,
  header: props => <AppHeader {...props} />,
  tabBarHideOnKeyboard: true,
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
