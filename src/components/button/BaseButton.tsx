import { StyleSheet, TouchableHighlight, View } from 'react-native'

import { BaseButtonProps } from './types'

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
    width: '100%',
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
