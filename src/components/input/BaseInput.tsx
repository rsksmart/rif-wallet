import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../../styles'

interface Props {
  value: string
  onChangeText: (text: string) => void
  testID?: string
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
  style?: ViewStyle
}

export const BaseInput: React.FC<Props> = ({
  value,
  onChangeText,
  testID,
  status = 'none',
  style,
}) => {
  const borderColor =
    status === 'valid'
      ? colors.border.green
      : status === 'invalid'
      ? colors.border.red
      : status === 'neutral'
      ? colors.lightPurple
      : 'transparent'

  return (
    <TextInput
      style={{ ...style, borderColor, ...styles.input }}
      value={value}
      onChangeText={onChangeText}
      testID={testID}
      spellCheck={false}
      autoCapitalize="none"
      selectionColor={borderColor}
    />
  )
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
  },
})
