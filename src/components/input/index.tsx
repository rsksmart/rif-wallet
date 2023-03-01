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
import { Typography } from '../typography'
import { AppTouchable } from '../appTouchable'

export { CustomInput } from './CustomInput'

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
  subtitleStyle?: StyleProp<TextStyle>
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
  subtitleStyle,
  onBlur: onBlurProp,
  onChangeText,
  onFocus: onFocusProp,
  ...props
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
          <View style={styles.contentContainer}>
            {label ? (
              <Typography style={[styles.label, labelStyle]} type={'body3'}>
                {focused || !!value || isReadOnly ? label : ''}
              </Typography>
            ) : null}
            <View style={styles.valueContainer}>
              {leftIcon && 'name' in leftIcon ? (
                <AppTouchable
                  width={leftIcon.size ? leftIcon.size : defaultIconSize}
                  onPress={onLeftIconPress ? onLeftIconPress : noop}>
                  <Icon
                    name={leftIcon.name}
                    size={leftIcon.size ? leftIcon.size : defaultIconSize}
                    color={leftIcon.color ? leftIcon.color : sharedColors.white}
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
                  style={[sharedStyles.flex, inputStyle]}
                  onChangeText={text => {
                    onChangeText && onChangeText(text)
                    onChange(text)
                  }}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  editable={!isReadOnly}
                  {...props}>
                  <Typography
                    style={[
                      styles.placeholderText,
                      value || isReadOnly ? styles.valueText : null,
                    ]}
                    type={!value ? (isReadOnly ? 'body2' : 'body3') : 'body2'}>
                    {placeholder && !focused && !value ? placeholder : value}
                  </Typography>
                </TextInput>
                {subtitle ? (
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
          {!rightIcon && !!value ? (
            <AppTouchable
              width={defaultIconSize}
              onPress={resetValue ? resetValue : noop}>
              <Icon
                name={'close'}
                size={defaultIconSize}
                color={sharedColors.white}
              />
            </AppTouchable>
          ) : rightIcon && 'name' in rightIcon ? (
            <Pressable onPress={onRightIconPress ? onRightIconPress : noop}>
              <Icon
                name={rightIcon.name}
                size={rightIcon.size ? rightIcon.size : defaultIconSize}
                color={rightIcon.color ? rightIcon.color : sharedColors.white}
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
    backgroundColor: sharedColors.inputInactive,
    paddingLeft: 16,
    paddingRight: 24,
    marginTop: 12,
    borderRadius: 10,
    minHeight: 54,
  }),
  containerActive: castStyle.view({
    backgroundColor: sharedColors.inputActive,
  }),
  contentContainer: castStyle.view({
    flex: 1,
    paddingBottom: 18,
  }),
  label: castStyle.text({
    marginTop: 10,
    color: sharedColors.inputLabelColor,
  }),
  valueContainer: castStyle.view({
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 18,
  }),
  inputSubtitleContainer: castStyle.view({
    marginLeft: 12,
  }),
  subtitle: castStyle.text({
    color: sharedColors.inputLabelColor,
  }),
  rightIcon: castStyle.text({
    flex: 1,
    marginRight: 24,
    color: sharedColors.white,
  }),
  placeholderText: castStyle.text({
    flex: 1,
    color: sharedColors.inputLabelColor,
  }),
  valueText: castStyle.text({
    color: sharedColors.white,
  }),
})
