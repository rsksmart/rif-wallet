import React from 'react'
import {
  StyleProp,
  StyleSheet,
  Text,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../../styles'

interface Props {
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
  suffix?: string
  inputStyle?: StyleProp<TextStyle>
  setValue?: (value: string) => void
}

export const BaseInput: React.FC<TextInputProps & Props> = ({
  status = 'none',
  suffix = '',
  inputStyle = {},
  setValue,
  ...params
}) => {
  const { fontSize, borderColor, ...rest } = StyleSheet.flatten(inputStyle)

  const borderColorValue =
    status === 'valid'
      ? colors.border.green
      : status === 'invalid'
      ? colors.border.red
      : status === 'neutral'
      ? colors.lightPurple
      : borderColor || 'transparent'

  return (
    <View style={{ ...styles.container, borderColor: borderColorValue }}>
      <TextInput
        style={{
          ...styles.input,
          ...rest,
          fontSize,
          borderColor: borderColorValue,
        }}
        onChangeText={setValue}
        maxLength={30}
        placeholderTextColor={colors.text.secondary}
        spellCheck={false}
        autoCapitalize="none"
        {...params}
      />
      {suffix ? (
        <Text style={{ ...styles.suffix, fontSize }}>{suffix}</Text>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.darkPurple4,
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 9,
    paddingVertical: 3,
  },
  input: {
    color: colors.lightPurple,
  },
  suffix: {
    position: 'absolute',
    right: 15,
    color: colors.lightPurple,
  },
})
