import {
  StyleSheet,
  View,
  ViewStyle,
  ButtonProps,
  ColorValue,
  StyleProp,
} from 'react-native'
import { IconProps } from 'react-native-vector-icons/Icon'
import Icon from 'react-native-vector-icons/FontAwesome'

import { AppTouchable } from 'components/appTouchable'
import { Typography } from 'components/typography'
import {
  defaultFontSize,
  defaultIconSize,
  sharedColors,
} from 'shared/constants'

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

const getJustifyContent = ({
  leftIcon,
  rightIcon,
}: {
  leftIcon?: IconProps
  rightIcon?: IconProps
}): ViewStyle =>
  leftIcon || rightIcon
    ? { justifyContent: 'space-between' }
    : { justifyContent: 'center' }

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

export interface AppButtonProps extends ButtonProps {
  textColor?: string
  backgroundVariety?: AppButtonBackgroundVarietyEnum
  widthVariety?: AppButtonWidthVarietyEnum
  cornerVariety?: AppButtonCornerVarietyEnum
  width?: number
  leftIcon?: IconProps
  rightIcon?: IconProps
  style?: StyleProp<ViewStyle>
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
      <View
        style={[styles.content, getJustifyContent({ leftIcon, rightIcon })]}>
        {leftIcon ? (
          <View style={styles.iconContainer}>
            <Icon
              name={leftIcon.name}
              size={leftIcon.size ? leftIcon.size : defaultIconSize}
              color={leftIcon.color ? leftIcon.color : textColor}
            />
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
            <Icon
              name={rightIcon.name}
              size={rightIcon.size ? rightIcon.size : defaultIconSize}
              color={rightIcon.color ? rightIcon.color : textColor}
            />
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
    fontSize: defaultFontSize,
  },
})

// Legacy buttons to remove
export { ActiveButton } from './ActiveButton'
export { DialButton } from './DialButton'
export { OutlineButton } from './OutlineButton'
export { PrimaryButton } from './PrimaryButton'
export { SecondaryButton } from './SecondaryButton'
export { TransferButton } from './TransferButton'
export { WhiteTransparentButton } from './WhiteButton'

// Button-like things
export { PaginationNavigator } from './PaginationNavigator'
export { ToggleButtons } from './ToggleButtons'
export { TokenButton } from './TokenButton'
