import React from 'react'
import { StyleSheet, View, KeyboardTypeOptions } from 'react-native'
import { CustomInput, RegularText } from '../../components'

type IInputField = {
  label: string
  value: string
  keyboardType: KeyboardTypeOptions
  placeholder: string
  testID: string
  handleValueOnChange: (value: string) => void
}
const InputField: React.FC<IInputField> = ({
  label,
  value,
  keyboardType,
  placeholder,
  testID,
  handleValueOnChange,
}) => {
  return (
    <>
      <View>
        <RegularText style={styles.label}>{label}</RegularText>
      </View>
      <View>
        <CustomInput
          value={value}
          onChange={handleValueOnChange}
          keyboardType={keyboardType}
          placeholder={placeholder}
          testID={testID}
        />
      </View>
    </>
  )
}

export default InputField

const styles = StyleSheet.create({
  label: {
    margin: 5,
  },
})
