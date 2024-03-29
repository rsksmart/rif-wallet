import { StyleSheet } from 'react-native'

import { grid } from '../../../styles'
import { colors } from '../../../styles/colors'

export const sharedMnemonicStyles = StyleSheet.create({
  parent: {
    backgroundColor: colors.darkBlue,
    flexDirection: 'row',
  },
  purpleParent: {
    backgroundColor: colors.blue,
    flexDirection: 'row',
  },
  topContent: {
    flexDirection: 'column',
  },
  sliderContainer: {
    flex: 5,
  },
  pagnationContainer: {
    flexDirection: 'column',
    marginBottom: 50,
  },
  wordContainer: {
    marginTop: 10,
    borderRadius: 10,
  },
  wordRow: {
    ...grid.row,
    backgroundColor: colors.blue,
    borderRadius: 10,
    padding: 15,
  },
  wordNumberBadge: {
    backgroundColor: colors.darkBlue,
    borderRadius: 20,
    width: 40,
    height: 40,
  },
  wordNumberBadgeText: {
    textAlign: 'center',
    color: colors.white,
    fontSize: 20,
    paddingTop: 7,
  },
  suggestionRow: {
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
    backgroundColor: colors.blue2,
  },
  // used for displaying the mnemonic and the suggestions
  wordText: {
    color: colors.white,
    fontSize: 17,
    marginLeft: 10,
    paddingTop: 8,
  },
})
