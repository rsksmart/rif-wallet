import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  ColorValue,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'

import { castStyle } from 'shared/utils'
import { sharedColors } from 'src/shared/constants'

interface Props {
  isEnabled: boolean
  size?: number
  containerStyle?: StyleProp<ViewStyle>
  iconStyle?: StyleProp<TextStyle>
  iconColor?: ColorValue
  enabledColor?: ColorValue
}

export const Checkbox = ({
  isEnabled,
  size,
  containerStyle,
  iconStyle,
  iconColor,
  enabledColor,
}: Props) => {
  return (
    <View
      style={[
        styles.checkbox,
        size ? { height: size, width: size, borderRadius: size / 4 } : null,
        isEnabled
          ? enabledColor
            ? { backgroundColor: enabledColor }
            : styles.checkboxEnabled
          : null,
        containerStyle,
      ]}>
      {isEnabled ? (
        <Icon
          style={iconStyle}
          name={'check'}
          color={iconColor ? iconColor : sharedColors.white}
          size={size ? size / 2 : 8}
        />
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  checkbox: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: sharedColors.borderColor,
    height: 16,
    width: 16,
    borderRadius: 4,
    backgroundColor: sharedColors.background.secondary,
    overflow: 'hidden',
  }),
  checkboxEnabled: castStyle.view({
    backgroundColor: sharedColors.primary,
  }),
})
