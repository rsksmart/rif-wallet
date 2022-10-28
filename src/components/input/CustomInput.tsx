import React, { useEffect, useState } from 'react'
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native'
import { Button } from '../button'
import { colors } from '../../styles'

export const CustomInput: React.FC<{
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string
  testID?: string
  keyboardType?: KeyboardTypeOptions
  value?: string
}> = ({ onChange, onSubmit, placeholder, testID, keyboardType, value }) => {
  const [text, setText] = useState(value ?? '')

  const handleSubmit = () => {
    if (!onSubmit) {
      return
    }
    onSubmit(text)
  }

  const handleChange = (textEntry: string) => {
    setText(textEntry)
    if (onChange) {
      onChange(textEntry)
    }
  }

  useEffect(() => {
    if (value !== undefined) {
      setText(value)
    }
  }, [value])

  return (
    <View style={styles.container}>
      <View style={styles.textInputWrapper}>
        <TextInput
          value={text}
          onChangeText={handleChange}
          style={styles.textInput}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          testID={testID}
          keyboardType={keyboardType}
        />
      </View>
      {onSubmit && (
        <View style={styles.buttonWrapper}>
          <Button
            title="&#10132;"
            style={styles.button}
            onPress={handleSubmit}
          />
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.white,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  text: {
    color: '#575757',
  },
  textDisabled: {
    color: '#cccccc',
  },
  textInputWrapper: {
    flex: 4,
  },
  textInput: {
    backgroundColor: 'transparent',
    // color: 'black', @todo revisit because in android this text is white and invisible...
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    minWidth: 0,
  },
})
