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
import { BaseInputStatus } from '../shared'
import { RegularText } from '../typography'
import { BaseInput } from './BaseInput'

interface Props {
  label: string
  style?: StyleProp<ViewStyle>
  inputStyle?: StyleProp<TextStyle>
  setValue?: (value: string) => void
  suffix?: string
  status?: BaseInputStatus
  optional?: boolean
}

export const TextInputWithLabel: React.FC<TextInputProps & Props> = ({
  label,
  style,
  inputStyle,
  setValue,
  suffix = '',
  status = BaseInputStatus.NONE,
  optional = false,
  ...params
}) => {
  return (
    <View style={style}>
      <View style={styles.labelView}>
        <RegularText style={styles.label}>{label}</RegularText>
        <RegularText style={styles.optional}>
          {optional ? 'optional' : ''}
        </RegularText>
      </View>
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
  labelView: {
    flexDirection: 'row',
  },
  label: {
    color: colors.lightPurple,
    paddingLeft: 5,
  },
  optional: {
    fontStyle: 'italic',
    color: colors.lightPurple,
    paddingLeft: 5,
    opacity: 0.5,
  },
})
