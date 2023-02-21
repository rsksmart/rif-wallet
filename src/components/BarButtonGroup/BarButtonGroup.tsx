import { PropsWithChildren } from 'react'
import { StyleSheet, View } from 'react-native'
import { Icon } from 'react-native-vector-icons/Icon'

import { sharedColors } from 'shared/constants'
import { AppTouchable } from 'components/appTouchable'

interface BarButtonGroupIconProps {
  iconName: string
  IconComponent: typeof Icon
  onPress: () => void
  size?: number

}

export const BarButtonGroupIcon = ({
  iconName,
  size = 24,
  IconComponent,
  onPress,
}: BarButtonGroupIconProps) => (
  <AppTouchable width={25} onPress={onPress} style={styles.iconContainerStyle}>
    <IconComponent name={iconName} color="white" size={size} />
  </AppTouchable>
)

interface BarButtonGroupContainerProps {
  backgroundColor?: string
}

export const BarButtonGroupContainer = ({
  backgroundColor = sharedColors.primaryDark,
  children,
}: PropsWithChildren<BarButtonGroupContainerProps>) => {
  return <View style={[styles.view, { backgroundColor }]}>{children}</View>
}

const styles = StyleSheet.create({
  view: {
    height: 64,
    flexDirection: 'row',
    opacity: 0.85,
  },
  iconContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
