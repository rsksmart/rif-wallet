import { ReactNode } from 'react'
import { ViewStyle } from 'react-native'
import { ColorValue } from 'react-native'
import { StyleSheet, TouchableHighlight, View } from 'react-native'

export interface BaseButtonProps {
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
  style?: ViewStyle
  underlayColor?: ColorValue
  children?: ReactNode
  onPress?: () => void
  onShowUnderlay?: () => void
  onHideUnderlay?: () => void
}

const BaseButton = ({
  children,
  style,
  underlayColor,
  disabled,
  testID,
  accessibilityLabel,
  onPress,
  onShowUnderlay,
  onHideUnderlay,
}: BaseButtonProps) => {
  return (
    <TouchableHighlight
      style={{ ...styles.container, ...style }}
      onPress={disabled ? undefined : onPress}
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}
      underlayColor={underlayColor}
      activeOpacity={1}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={accessibilityLabel}>
      <View style={styles.wrapper}>{children}</View>
    </TouchableHighlight>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  wrapper: {
    display: 'flex',
    alignContent: 'flex-end',
  },
})

export default BaseButton
