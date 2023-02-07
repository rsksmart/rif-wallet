import { useCallback, useState, ReactNode, ReactFragment } from 'react'
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

import { defaultIconSize, noop, sharedColors } from 'shared/constants'
import { castStyle } from 'shared/utils'
import { Typography } from '../typography'

export { CustomInput } from './CustomInput'

interface Props extends TextInputProps {
  label: string
  inputName: string
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
}: Props) => {
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
            <Typography style={[styles.label, labelStyle]} type={'body3'}>
              {focused || !!value || isReadOnly ? label : ''}
            </Typography>
            <View style={styles.valueContainer}>
              {leftIcon && 'name' in leftIcon ? (
                <Pressable onPress={onLeftIconPress ? onLeftIconPress : noop}>
                  <Icon
                    name={leftIcon.name}
                    size={leftIcon.size ? leftIcon.size : defaultIconSize}
                    color={leftIcon.color ? leftIcon.color : sharedColors.white}
                  />
                </Pressable>
              ) : (
                leftIcon
              )}
              <View style={[leftIcon ? styles.inputSubtitleContainer : null]}>
                <TextInput
                  style={[styles.input, inputStyle]}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  onFocus={onFocus}
                  editable={!isReadOnly}>
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
                  <Typography style={styles.subtitle} type={'body3'}>
                    {subtitle}
                  </Typography>
                ) : null}
              </View>
            </View>
          </View>
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
  }),
  containerActive: castStyle.view({
    backgroundColor: sharedColors.inputActive,
  }),
  contentContainer: castStyle.view({
    flex: 1,
    paddingBottom: 14,
  }),
  label: castStyle.text({
    marginTop: 10,
    color: sharedColors.inputLabelColor,
  }),
  valueContainer: castStyle.view({
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
  }),
  inputSubtitleContainer: castStyle.view({
    marginLeft: 12,
  }),
  subtitle: castStyle.text({
    color: sharedColors.inputLabelColor,
  }),
  input: castStyle.text({}),
  rightIcon: castStyle.text({
    marginRight: 24,
    color: sharedColors.white,
  }),
  placeholderText: castStyle.text({
    color: sharedColors.inputLabelColor,
  }),
  valueText: castStyle.text({
    color: sharedColors.white,
  }),
})
