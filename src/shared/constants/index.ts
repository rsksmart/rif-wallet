import { StyleSheet } from 'react-native'

import { castStyle } from '../utils'

export const testIDs = {
  wordInput: 'input.wordInput',
  indexLabel: 'view.indexLabel',
  hide: 'hide',
  swap: 'swap',
}

export const sharedColors = {
  primary: '#4B5CF0',
  secondary: '#121212',
  success: '#79C600',
  successLight: '#59FF9C',
  warning: '#FF9100',
  danger: '#E94141',
  dangerLight: '#ED6060',
  white: '#FFFFFF',
  inputInactive: '#252525',
  inputActive: '#3A3A3A',
  inputLabelColor: '#B8B8B8',
  borderColor: '#575757',
  primaryDark: '#4250CC',
  labelLight: '#B8B8B8',
  subTitle: '#FBFBFB',
  tokenBackground: '#1E1E1E',
  black: '#000000',
  qrColor: '#DBE3FF',
}

export const tokenColors = {
  rbtc: '#71BD35',
  btc: '#FF9100',
  rif: '#4B5CF0',
  rdoc: '#11B55C',
  generic: '#252525',
}
export const defaultFontSize = 16
export const defaultIconSize = 16
export const noop = () => ({})

export const sharedStyles = StyleSheet.create({
  flex: castStyle.view({
    flex: 1,
  }),
  row: castStyle.view({
    flexDirection: 'row',
  }),
  textCenter: castStyle.text({
    textAlign: 'center',
  }),
  textLeft: castStyle.text({
    textAlign: 'left',
  }),
  textRight: castStyle.text({
    textAlign: 'right',
  }),
  contentCenter: castStyle.view({
    justifyContent: 'center',
    alignItems: 'center',
  }),
  marginLeft24: castStyle.view({ marginLeft: 24 }),
  screen: castStyle.view({
    flex: 1,
    backgroundColor: sharedColors.black,
    paddingHorizontal: 24,
  }),
  noPadding: castStyle.view({ padding: 0 }),
  selfCenter: castStyle.view({
    alignSelf: 'center',
  }),
  widthHalfWidth: castStyle.view({
    width: '50%',
  }),
  widthFullWidth: castStyle.view({
    width: '100%',
  }),
})
