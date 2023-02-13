import { StyleSheet, View, ButtonProps } from 'react-native'
import { useCallback } from 'react'
import { AppTouchable } from 'components/appTouchable'
import { ViewStyle } from 'react-native'
import { Typography } from 'src/components'
import { sharedColors } from 'shared/constants'
import Icon from 'react-native-vector-icons/FontAwesome'

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
}

const AppButton = ({
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
  const getBackgroundVariety = useCallback(() => {
    switch (backgroundVariety) {
      case AppButtonBackgroundVarietyEnum.OUTLINED:
        return { borderColor: color, borderWidth: 1 }
      case AppButtonBackgroundVarietyEnum.GHOST:
        return { borderColor: color }
      default:
        return { backgroundColor: color }
    }
  }, [backgroundVariety, color])

  const getWidthVariety = useCallback(() => {
    switch (widthVariety) {
      case AppButtonWidthVarietyEnum.FULL:
        return { width: '100%' }
      default:
        return {}
    }
  }, [widthVariety])

  const getCornerVariety = useCallback(() => {
    switch (cornerVariety) {
      case AppButtonCornerVarietyEnum.SQUARE:
        return { borderRadius: 10 }
      default:
        return { borderRadius: 25 }
    }
  }, [cornerVariety])

  const getJustifyContent = () =>
    leftIcon || rightIcon
      ? { justifyContent: 'space-between' }
      : { justifyContent: 'center' }

  return (
    <AppTouchable
      width={width}
      style={[
        getBackgroundVariety(),
        getCornerVariety(),
        getWidthVariety(),
        style,
      ]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}>
      <View style={[styles.content, getJustifyContent() as ViewStyle]}>
        {leftIcon ? (
          <View style={styles.iconContainer}>
            <Icon name={leftIcon} size={15} color={textColor} />
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
            <Icon name={rightIcon} size={15} color={textColor} />
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
    paddingTop: 15,
    paddingBottom: 15,
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
    paddingTop: 3,
    fontSize: 15,
  },
})

export default AppButton
