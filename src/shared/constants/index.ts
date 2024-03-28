import { Dimensions } from 'react-native'

export { ChainTypeEnum, chainTypesById } from './chainConstants'
export { sharedColors, tokenColors } from './colors'
export { sharedStyles } from './styles'

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

export const defaultFontSize = 16
export const defaultIconSize = 16
export const noop = () => {}

export const WINDOW_WIDTH = Dimensions.get('window').width
export const WINDOW_HEIGHT = Dimensions.get('window').height
export const SLIDER_WIDTH = Math.round(WINDOW_WIDTH * 0.8)
export const SLIDER_HEIGHT = Math.round(WINDOW_HEIGHT * 0.75)

export const bitcoinTestnet = { name: 'BITCOIN_TESTNET', bips: ['BIP84'] }
export const bitcoinMainnet = { name: 'BITCOIN', bips: ['BIP84'] }
