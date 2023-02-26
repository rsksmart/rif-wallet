import { useCallback, useState, ReactFragment } from 'react'
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
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
  placeholderStyle?: StyleProp<TextStyle>
  subtitleStyle?: StyleProp<TextStyle>
  suffix?: ReactFragment
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
  suffix,
  ...textInputProps
}: InputProps) => {
  const { control } = useFormContext()
  const [focused, setFocused] = useState<boolean>(false)

  const onFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])

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
                <Pressable
                  style={styles.leftIconContainer}
                  onPress={onLeftIconPress ? onLeftIconPress : noop}>
                  <Icon
                    name={leftIcon.name}
                    size={leftIcon.size ? leftIcon.size : defaultIconSize}
                    color={leftIcon.color ? leftIcon.color : sharedColors.white}
                  />
                </Pressable>
              ) : (
                leftIcon
              )}
              <View
                style={[
                  sharedStyles.flex,
                  leftIcon ? styles.inputSubtitleContainer : null,
                ]}>
                <TextInput
                  {...textInputProps}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  editable={!isReadOnly}
                  style={[styles.input, inputStyle]}>
                  <Typography
                    style={[
                      styles.placeholderText,
                      value || isReadOnly ? styles.valueText : null,
                      placeholderStyle,
                    ]}
                    type={!value ? (isReadOnly ? 'body2' : 'body3') : 'body2'}>
                    {placeholder && !focused && !value ? placeholder : value}
                  </Typography>
                </TextInput>
                {subtitle ? (
                  <Typography
                    style={[styles.subtitle, subtitleStyle]}
                    type={'body3'}>
                    {subtitle}
                  </Typography>
                ) : null}
              </View>
            </View>
          </View>
          {suffix}
          {!rightIcon && !!value ? (
            <Pressable onPress={resetValue ? resetValue : noop}>
              <Icon
                name={'close'}
                size={defaultIconSize}
                color={sharedColors.white}
              />
            </Pressable>
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
  }),
  leftIconContainer: castStyle.view({
    paddingTop: 18,
  }),
  inputSubtitleContainer: castStyle.view({
    marginLeft: 12,
  }),
  subtitle: castStyle.text({
    color: sharedColors.inputLabelColor,
  }),
  input: castStyle.text({
    flex: 1,
    paddingTop: 18,
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
