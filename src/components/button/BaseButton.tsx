import React, { ReactNode } from 'react'
import { TouchableHighlight, View, StyleSheet } from 'react-native'

export interface BaseButtonInterface {
  onPress?: () => any
  disabled?: boolean
  testID?: string
  accessibilityLabel?: string
  style?: any
  underlayColor?: string
}

const BaseButton: React.FC<BaseButtonInterface & { children: ReactNode }> = ({
  children,
  style,
  underlayColor,
  disabled,
  testID,
  accessibilityLabel,
  onPress,
}) => {
  return (
    <TouchableHighlight
      style={{ ...styles.container, ...style }}
      onPress={disabled ? undefined : onPress}
      underlayColor={underlayColor}
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
