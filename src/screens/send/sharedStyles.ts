import { StyleSheet } from 'react-native'
import { colors } from '../../styles'

export const sharedStyles = StyleSheet.create({
  label: {
    color: colors.white,
    padding: 10,
  },
  textInputStyle: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    padding: 22,
    backgroundColor: colors.darkPurple4,
  },
  error: {
    color: colors.orange,
  },
})
