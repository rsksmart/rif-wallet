import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { RegularText } from '../typography'
import { colors } from '../../styles'

const AddAccountBox: React.FC<{ addNewWallet: any }> = ({ addNewWallet }) => {
  return (
    <TouchableOpacity style={styles.accountBoxContainer} onPress={addNewWallet}>
      <RegularText style={styles.accountText}>+</RegularText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  accountBoxContainer: {
    backgroundColor: colors.background.purple,
    height: 160,
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
