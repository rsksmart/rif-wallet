import { ColorValue } from 'react-native'
import { StackNavigationOptions } from '@react-navigation/stack'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { AppTouchable, Typography } from 'components/index'
import { sharedColors, sharedStyles } from 'shared/constants'

export const screenOptionsWithHeader = (
  title?: string,
  color?: ColorValue,
): StackNavigationOptions => ({
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
    <Typography type={'h3'} style={props.style}>
      {title ?? props.children}
    </Typography>
  ),
  headerStyle: {
    height: 64,
    backgroundColor: color ?? sharedColors.black,
  },
  headerStatusBarHeight: 0,
  headerShadowVisible: false,
})
