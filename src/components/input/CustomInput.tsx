import React, { useState } from 'react'
import { KeyboardTypeOptions, StyleSheet, TextInput, View } from 'react-native'
import { Button } from '../button'

export const CustomInput: React.FC<{
  onChange?: (text: string) => void
  onSubmit?: (text: string) => void
  placeholder?: string
  testID?: string
  keyboardType?: KeyboardTypeOptions
}> = ({ onChange, onSubmit, placeholder, testID, keyboardType }) => {
  const [text, setText] = useState('')

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

  return (
    <View style={styles.container}>
      <View style={styles.textInputWrapper}>
        <TextInput
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
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: '#e6e6e6',
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
  },
  buttonWrapper: {
    flex: 1,
  },
  button: {
    minWidth: 0,
  },
})
