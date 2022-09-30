import React from 'react'
import { StyleSheet, TextInput, View } from 'react-native'
import { colors } from '../../styles'
import { fonts } from '../../styles/fonts'
import { RegularText } from '../typography'

interface TextInputInterface {
  label: string
  placeholder?: string
  testID?: string
  value: string
  setValue: (value: string) => void
  multiline?: boolean
  inputStyle?: any
}

export const TextInputWithLabel: React.FC<TextInputInterface> = ({
  label,
  placeholder,
  testID,
  value,
  setValue,
  multiline,
  inputStyle,
}) => {
  const inputStyles = inputStyle
    ? { ...inputStyle, ...styles.input }
    : styles.input
  return (
    <View>
      <RegularText style={styles.label}>{label}</RegularText>
      <TextInput
        testID={testID}
        accessibilityLabel="nameInput"
        style={inputStyles}
        onChangeText={setValue}
        value={value}
        placeholder={placeholder}
        placeholderTextColor={colors.text.secondary}
        multiline={multiline || false}
        textAlignVertical="top"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  label: {
    color: colors.white,
    paddingLeft: 5,
    paddingBottom: 10,
  },
  input: {
    color: colors.text.primary,
    fontFamily: fonts.regular,
    backgroundColor: colors.darkPurple4,
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
})
