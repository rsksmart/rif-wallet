import { PropsWithChildren } from 'react'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import { Icon } from 'react-native-vector-icons/Icon'

import { sharedColors } from 'shared/constants'

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
  <TouchableOpacity onPress={onPress} style={styles.iconContainerStyle}>
    <IconComponent name={iconName} color="white" size={size} />
  </TouchableOpacity>
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
  },
  iconContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
