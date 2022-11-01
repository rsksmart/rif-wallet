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
import { fonts } from '../../styles/fonts'

interface Props {
  inputStyle?: StyleProp<TextStyle>
  setValue?: (value: string) => void
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
  suffix?: string
}

export const BaseInput: React.FC<TextInputProps & Props> = ({
  inputStyle = {},
  setValue,
  status = 'none',
  suffix = '',
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

  const inputStyles = {
    ...styles.input,
    ...rest,
    fontSize,
    borderColor: borderColorValue,
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={inputStyles}
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
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    color: colors.lightPurple,
    backgroundColor: colors.darkPurple4,
    borderWidth: 1,
    borderRadius: 15,
    padding: 15,
  },
  suffix: {
    position: 'absolute',
    right: 15,
    top: 15,
    color: colors.lightPurple,
  },
})
