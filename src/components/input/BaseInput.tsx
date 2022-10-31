import React from 'react'
import { StyleSheet, Text, TextInputProps, TextStyle, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../../styles'

interface Props {
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
  suffix?: string
  style?: TextStyle
}

export const BaseInput: React.FC<TextInputProps & Props> = ({
  status = 'none',
  suffix = '',
  style,
  onChangeText,
  ...params
}) => {
  const borderColor =
    status === 'valid'
      ? colors.border.green
      : status === 'invalid'
      ? colors.border.red
      : status === 'neutral'
      ? colors.lightPurple
      : 'transparent'

  const fontSize = style?.fontSize || 16

  return (
    <View style={{ ...styles.container, borderColor }}>
      <TextInput
        style={{ ...styles.input, ...style, fontSize }}
        onChangeText={onChangeText}
        maxLength={30}
        {...params}
      />
      {suffix && <Text style={{ ...styles.suffix, fontSize }}>{suffix}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.background.secondary,
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
