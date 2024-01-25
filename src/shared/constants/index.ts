import { StyleSheet, Dimensions } from 'react-native'

import { castStyle } from '../utils'

export const testIDs = {
  wordInput: 'input.wordInput',
  indexLabel: 'view.indexLabel',
  hide: 'hide',
  swap: 'swap',
  searchInput: 'searchInput',
  saveButton: 'saveButton',
  nameInput: 'nameInput',
  addressInput: 'addressInput',
  newContact: 'newContact',
}

export const sharedColors = {
  primary: '#4B5CF0',
  secondary: '#121212',
  success: '#79C600',
  successLight: '#59FF9C',
  connected: '#01CB9F',
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
  errorBackground: '#FF3559',
  lightPurple: '#DAE2FF',
  blue: '#6053F8',
}

export const tokenColors = {
  rbtc: '#71BD35',
  btc: '#EB7D00',
  rif: '#4152E6',
  rdoc: '#11B55C',
  generic: '#252525',
}
export const defaultFontSize = 16
export const defaultIconSize = 16
export const noop = () => {}

export const sharedStyles = StyleSheet.create({
  displayNone: castStyle.view({
    display: 'none',
  }),
  flex: castStyle.view({
    flex: 1,
  }),
  flexGrow: castStyle.view({
    flexGrow: 1,
  }),
  flexAlignEnd: castStyle.view({
    alignSelf: 'flex-end',
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
  alignCenter: castStyle.view({
    alignItems: 'center',
  }),
  marginLeft24: castStyle.view({ marginLeft: 24 }),
  marginTop40: castStyle.view({ marginTop: 40 }),
  marginRight24: castStyle.view({ marginRight: 24 }),
  paddingHorizontal24: castStyle.view({
    paddingHorizontal: 24,
  }),
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
  fontBoldText: castStyle.text({
    fontWeight: 'bold',
  }),
  appButtonBottom: castStyle.view({
    backgroundColor: sharedColors.white,
    position: 'absolute',
    bottom: 30,
    left: 24,
    right: 24,
  }),
  /* GRID */
  column12: {
    display: 'flex',
    width: '100%',
  },
  column10: {
    display: 'flex',
    width: '83.333%',
  },
  column9: {
    display: 'flex',
    width: '75%',
  },
  column8: {
    display: 'flex',
    width: '66.667%',
  },
  column7: {
    display: 'flex',
    width: '56.667%',
  },
  column6: {
    display: 'flex',
    width: '50%',
  },
  column5: {
    display: 'flex',
    width: '41.667%',
  },
  column4: {
    display: 'flex',
    width: '33%',
  },
  column3: {
    display: 'flex',
    width: '25%',
  },
  column2: {
    display: 'flex',
    width: '16.667%',
  },
  column1: {
    display: 'flex',
    width: '8.333%',
  },
  column: {
    display: 'flex',
  },

  offset1: {
    marginLeft: '8.3%',
  },
  offset3: {
    marginLeft: '25%',
  },
})
export const WINDOW_WIDTH = Dimensions.get('window').width
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const SLIDER_WIDTH = Math.round(WINDOW_WIDTH * 0.8)
export const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.75)

export const bitcoinTestnet = { name: 'BITCOIN_TESTNET', bips: ['BIP84'] }
export const bitcoinMainnet = { name: 'BITCOIN', bips: ['BIP84'] }
