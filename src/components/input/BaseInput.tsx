import React from 'react'
import { StyleSheet, Text, View, ViewStyle } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { colors } from '../../styles'

interface Props {
  value: string
  onChangeText: (text: string) => void
  testID?: string
  status?: 'valid' | 'invalid' | 'neutral' | 'none'
  style?: ViewStyle,
  suffix?: string
}

export const BaseInput: React.FC<Props> = ({
  value,
  onChangeText,
  testID,
  status = 'none',
  style,
  suffix
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
    <View style={styles.container}>
      <TextInput
        style={{ ...style, borderColor, ...styles.input }}
        value={value}
        onChangeText={onChangeText}
        testID={testID}
        spellCheck={false}
        autoCapitalize="none"
        selectionColor={borderColor}
        maxLength={30}
      />
      {suffix && <Text style={styles.suffix}>{suffix}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
  },
  suffix: {
    position: 'absolute',
    right: 15,
    color: colors.lightPurple,
  },
})
