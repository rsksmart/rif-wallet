import { useCallback, useState, ReactFragment } from 'react'
import {
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputFocusEventData,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { IconProps } from 'react-native-vector-icons/Icon'
import { Controller, useFormContext, FieldError } from 'react-hook-form'

import {
  defaultIconSize,
  noop,
  sharedColors,
  sharedStyles,
} from 'shared/constants'
import { castStyle } from 'shared/utils'
import { AppTouchable } from 'components/appTouchable'

import { Typography } from '../typography'

export { CustomInput } from './CustomInput'

enum TestID {
  InputLabel = 'InputLabel',
}

export interface InputProps extends TextInputProps {
  inputName: string
  label?: string
  resetValue?: () => void
  onLeftIconPress?: () => void
  onRightIconPress?: () => void
  isReadOnly?: boolean
  subtitle?: string
  error?: FieldError
  leftIcon?: IconProps | ReactFragment
  rightIcon?: IconProps | ReactFragment
  containerStyle?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  labelStyle?: StyleProp<TextStyle>
  placeholderStyle?: StyleProp<TextStyle>
  subtitleStyle?: StyleProp<TextStyle>
  suffix?: ReactFragment
  inputRef?: (ref: TextInput) => void
  forceShowSubtitle?: boolean
}

export const Input = ({
  label,
  subtitle,
  inputName,
  placeholder,
  leftIcon,
  rightIcon,
  resetValue,
  onRightIconPress,
  onLeftIconPress,
  isReadOnly,
  containerStyle,
  inputStyle,
  labelStyle,
  placeholderStyle,
  subtitleStyle,
  onBlur: onBlurProp,
  onChangeText,
  onFocus: onFocusProp,
  suffix,
  inputRef,
  value: propValue,
  forceShowSubtitle = false,
  ...textInputProps
}: InputProps) => {
  const { control } = useFormContext()
  const [focused, setFocused] = useState<boolean>(false)

  const onFocus = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocusProp && onFocusProp(e)
      setFocused(true)
    },
    [onFocusProp],
  )

  const onBlur = useCallback(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlurProp && onBlurProp(e)
      setFocused(false)
    },
    [onBlurProp],
  )

  return (
    <Controller
      control={control}
      name={inputName}
      render={({ field: { onChange, value } }) => (
        <View
          style={[
            styles.container,
            focused || !!value ? styles.containerActive : null,
            containerStyle,
          ]}>
          <View
            style={[
              sharedStyles.flex,
              focused || value || isReadOnly ? styles.contentPadding : null,
            ]}>
            {label && (focused || !!value || isReadOnly) ? (
              <Typography
                style={[styles.label, labelStyle]}
                type={'body3'}
                accessibilityLabel={TestID.InputLabel}>
                {label}
              </Typography>
            ) : null}
            <View style={styles.valueContainer}>
              {leftIcon && 'name' in leftIcon ? (
                <AppTouchable
                  width={leftIcon.size || defaultIconSize}
                  onPress={onLeftIconPress || noop}>
                  <Icon
                    name={leftIcon.name}
                    size={leftIcon.size || defaultIconSize}
                    color={leftIcon.color || sharedColors.text.primary}
                  />
                </AppTouchable>
              ) : (
                leftIcon
              )}
              <View
                style={[
                  sharedStyles.flex,
                  leftIcon ? styles.inputSubtitleContainer : null,
                ]}>
                <TextInput
                  style={[
                    sharedStyles.flex,
                    sharedStyles.noPadding,
                    focused && !subtitle && (rightIcon || suffix || resetValue)
                      ? styles.inputPadding
                      : null,
                    inputStyle,
                  ]}
                  onChangeText={text =>
                    onChangeText ? onChangeText(text) : onChange(text)
                  }
                  onBlur={onBlur}
                  onFocus={onFocus}
                  editable={!isReadOnly}
                  ref={inputRef}
                  {...textInputProps}>
                  <Typography
                    style={[
                      styles.placeholderText,
                      value || isReadOnly ? styles.valueText : null,
                      placeholderStyle,
                    ]}
                    type={!value ? (isReadOnly ? 'body2' : 'body3') : 'body2'}>
                    {placeholder && !focused && !value
                      ? placeholder
                      : propValue ?? value}
                  </Typography>
                </TextInput>
                {subtitle && (!!value || isReadOnly || forceShowSubtitle) ? (
                  <Typography
                    style={[styles.subtitle, subtitleStyle]}
                    type={'body3'}
                    numberOfLines={1}>
                    {subtitle}
                  </Typography>
                ) : null}
              </View>
            </View>
          </View>
          {suffix}
          {!rightIcon && !!value && resetValue ? (
            <AppTouchable width={defaultIconSize} onPress={resetValue}>
              <Icon
                style={styles.rightIcon}
                name={'close'}
                size={defaultIconSize}
                color={sharedColors.text.primary}
              />
            </AppTouchable>
          ) : rightIcon && 'name' in rightIcon ? (
            <Pressable onPress={onRightIconPress || noop}>
              <Icon
                style={styles.rightIcon}
                name={rightIcon.name}
                size={rightIcon.size || defaultIconSize}
                color={rightIcon.color || sharedColors.text.primary}
              />
            </Pressable>
          ) : (
            rightIcon
          )}
        </View>
      )}
    />
  )
}

const styles = StyleSheet.create({
  container: castStyle.view({
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: sharedColors.background.secondary,
    paddingLeft: 16,
    paddingRight: 16,
    marginTop: 12,
    borderRadius: 10,
    minHeight: 80,
  }),
  containerActive: castStyle.view({
    backgroundColor: sharedColors.input.active,
  }),
  contentPadding: castStyle.view({
    paddingBottom: 18,
  }),
  label: castStyle.text({
    marginTop: 10,
    marginBottom: 4,
    color: sharedColors.text.label,
  }),
  valueContainer: castStyle.view({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  }),
  inputPadding: castStyle.view({
    paddingBottom: 10,
  }),
  inputSubtitleContainer: castStyle.view({
    marginLeft: 12,
  }),
  subtitle: castStyle.text({
    color: sharedColors.text.label,
  }),
  rightIcon: castStyle.text({
    padding: defaultIconSize,
  }),
  placeholderText: castStyle.text({
    flex: 1,
    color: sharedColors.text.label,
  }),
  valueText: castStyle.text({
    marginTop: 14,
    color: sharedColors.text.primary,
  }),
})
