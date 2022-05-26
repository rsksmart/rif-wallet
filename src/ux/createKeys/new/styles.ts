import { StyleSheet } from 'react-native'
import { colors } from '../../../styles/colors'

export const sharedMnemonicStyles = StyleSheet.create({
  wordContainer: {
    padding: 15,
    color: colors.white,
    flexDirection: 'row',
    backgroundColor: colors.blue,
    fontWeight: 'bold',
    borderRadius: 10,
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

  // used for displaying the mnemonic and the suggestions
  wordText: {
    color: colors.white,
    fontSize: 20,
    marginLeft: 10,
    paddingTop: 5,
  },
})
