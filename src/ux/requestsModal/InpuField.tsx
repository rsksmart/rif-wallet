import { StyleSheet, View, KeyboardTypeOptions } from 'react-native'
import { CustomInput, RegularText } from '../../components'

interface IInputField {
  label: string
  value: string
  keyboardType: KeyboardTypeOptions
  placeholder: string
  testID: string
  handleValueOnChange: (value: string) => void
}

const InputField = ({
  label,
  value,
  keyboardType,
  placeholder,
  testID,
  handleValueOnChange,
}: IInputField) => {
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
