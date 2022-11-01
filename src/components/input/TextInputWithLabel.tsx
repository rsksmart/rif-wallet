import React from 'react'
import {
  StyleProp,
  StyleSheet,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native'
import { colors } from '../../styles'
import { RegularText } from '../typography'
import { BaseInput } from './BaseInput'

interface Props {
  label: string
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  setValue?: (value: string) => void
  suffix?: string
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
}

export const TextInputWithLabel: React.FC<TextInputProps & Props> = ({
  label,
  style,
  inputStyle,
  setValue,
  suffix = '',
  status = 'none',
  ...params
}) => {
  return (
    <View style={style}>
      <RegularText style={styles.label}>{label}</RegularText>
      <BaseInput
        accessibilityLabel="nameInput"
        inputStyle={inputStyle}
        setValue={setValue}
        status={status}
        suffix={suffix}
        {...params}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: colors.white,
    paddingLeft: 5,
  },
})
