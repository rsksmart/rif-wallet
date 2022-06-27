import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { RegularText } from '../typography'
import { colors } from '../../styles'

// @TODO implement onPress => create new account flow
const AddAccountBox: React.FC<any> = () => {
  return (
    <TouchableOpacity style={styles.accountBoxContainer}>
      <RegularText style={styles.accountText}>+</RegularText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  accountBoxContainer: {
    backgroundColor: colors.background.purple,
    height: 160,
    marginTop: 20,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  accountText: {
    color: 'white',
    fontSize: 60,
  },
})
export default AddAccountBox
