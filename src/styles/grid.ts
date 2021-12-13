import { StyleSheet } from 'react-native'

// Based on a 12 column grid structure:
export const grid = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
  },
  column6: {
    display: 'flex',
    width: '50%',
  },
  column4: {
    display: 'flex',
    width: '33%',
  },
  column3: {
    display: 'flex',
    width: '25%',
  },
})
