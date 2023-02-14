import { StyleSheet, View, ButtonProps, ColorValue } from 'react-native'
import { AppTouchable } from 'components/appTouchable'
import { ViewStyle } from 'react-native'
import { Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import Icon from 'react-native-vector-icons/FontAwesome'

const getBackgroundVariety = (
  backgroundVariety: AppButtonBackgroundVarietyEnum,
  color: ColorValue,
): ViewStyle => {
  switch (backgroundVariety) {
    case AppButtonBackgroundVarietyEnum.OUTLINED:
      return { borderColor: color, borderWidth: 1 }
    case AppButtonBackgroundVarietyEnum.GHOST:
      return { borderColor: color }
    default:
      return { backgroundColor: color }
  }
}

const getWidthVariety = (
  widthVariety: AppButtonWidthVarietyEnum,
): ViewStyle => {
  switch (widthVariety) {
    case AppButtonWidthVarietyEnum.FULL:
      return { width: '100%' }
    default:
      return {}
  }
}

const getCornerVariety = (
  cornerVariety: AppButtonCornerVarietyEnum,
): ViewStyle => {
  switch (cornerVariety) {
    case AppButtonCornerVarietyEnum.SQUARE:
      return { borderRadius: 10 }
    default:
      return { borderRadius: 25 }
  }
}

export enum AppButtonBackgroundVarietyEnum {
  DEFAULT = 'DEFAULT',
  OUTLINED = 'OUTLINED',
  GHOST = 'GHOST',
}
export enum AppButtonWidthVarietyEnum {
  FULL = 'FULL',
  INLINE = 'INLINE',
}
export enum AppButtonCornerVarietyEnum {
  ROUND = 'ROUND',
  SQUARE = 'SQUARE',
}
interface AppButtonProps extends ButtonProps {
  textColor?: string
  backgroundVariety?: AppButtonBackgroundVarietyEnum
  widthVariety?: AppButtonWidthVarietyEnum
  cornerVariety?: AppButtonCornerVarietyEnum
  width?: number
  leftIcon?: string
  rightIcon?: string
  style?: ViewStyle
  disabled?: boolean
}
export const AppButton = ({
  title,
  disabled,
  accessibilityLabel = '',
  onPress,
  color = sharedColors.inputInactive,
  textColor = sharedColors.white,
  backgroundVariety = AppButtonBackgroundVarietyEnum.DEFAULT,
  widthVariety = AppButtonWidthVarietyEnum.FULL,
  cornerVariety = AppButtonCornerVarietyEnum.ROUND,
  width = 100,
  leftIcon,
  rightIcon,
  style,
}: AppButtonProps) => {
  const getJustifyContent = () =>
    leftIcon || rightIcon
      ? { justifyContent: 'space-between' }
      : { justifyContent: 'center' }

  return (
    <AppTouchable
      width={width}
      style={[
        getBackgroundVariety(backgroundVariety, color),
        getWidthVariety(widthVariety),
        getCornerVariety(cornerVariety),
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}>
      <View style={[styles.content, getJustifyContent() as ViewStyle]}>
        {leftIcon ? (
          <View style={styles.iconContainer}>
            <Icon name={leftIcon} size={16} color={textColor} />
          </View>
        ) : null}
        <View style={styles.textContainer}>
          <Typography
            type={'button1'}
            accessibilityLabel={accessibilityLabel}
            style={[styles.text, { color: textColor }]}>
            {title}
          </Typography>
        </View>
        {rightIcon ? (
          <View style={styles.iconContainer}>
            <Icon name={rightIcon} size={16} color={textColor} />
          </View>
        ) : null}
      </View>
    </AppTouchable>
  )
}

const styles = StyleSheet.create({
  content: {
    borderRadius: 25,
    flexDirection: 'row',
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 20,
    paddingRight: 20,
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  text: {
    paddingTop: 4,
    fontSize: 16,
  },
})
