import { StyleSheet } from 'react-native'
import { castStyle } from '../utils'

export const testIDs = {
  wordInput: 'input.wordInput',
  indexLabel: 'view.indexLabel',
}

export const sharedColors = {
  primary: '#4B5CF0',
  secondary: '#121212',
  success: '#79C600',
  warning: '#FF9100',
  danger: '#E94141',
  white: '#FFFFFF',
  inputInactive: '#252525',
  inputActive: '#3A3A3A',
  inputLabelColor: '#B8B8B8',
  borderColor: '#575757',
}

export const tokenColors = {
  rbtc: '#71BD35',
  btc: '#FF9100',
  rif: '#4B5CF0',
  rdoc: '#11B55C',
  generic: '#252525',
}

export const defaultIconSize = 16
export const noop = () => ({})

export const sharedStyles = StyleSheet.create({
  flex: castStyle.view({
    flex: 1,
  }),
})
