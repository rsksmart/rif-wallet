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
      <View style={{ flex: 4 }}>
        <TextInput
          onChangeText={handleChange}
          style={{ backgroundColor: 'transparent' }}
          onSubmitEditing={handleSubmit}
          placeholder={placeholder}
          testID={testID}
          keyboardType={keyboardType}
        />
      </View>
      {onSubmit && (
        <View style={{ flex: 1 }}>
          <Button
            title="&#10132;"
            style={{ minWidth: 0 }}
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
})
