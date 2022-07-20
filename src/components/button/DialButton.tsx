import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import { colors } from '../../styles'
import { MediumText } from '../typography'

type Props = {
  disabled?: boolean
  label: string
  testID: string
  variant?: 'default' | 'error' | 'success'
  onPress: () => void
}

export const DialButton: React.FC<Props> = ({
  disabled,
  label,
  testID,
  variant = 'default',
  onPress,
}) => {
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPress}
      style={{ ...styles.root, ...styles[variant] }}
      testID={testID}>
      <MediumText style={styles.label}>{label}</MediumText>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    borderRadius: 100,
    height: 71,
    justifyContent: 'center',
    width: 71,
    backgroundColor: '#2B295B',
  },
  default: {
    borderColor: 'rgba(255, 255, 255, 0.23)',
  },
  error: {
    borderColor: 'rgba(248, 159, 132, 1)',
  },
  success: {
    borderColor: 'rgba(113, 245, 174, 0.23)',
  },
  label: {
    color: colors.white,
    fontSize: 19,
  },
})
