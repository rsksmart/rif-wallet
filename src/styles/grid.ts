import { StyleSheet } from 'react-native'

// Based on a 12 column grid structure:
export const grid = StyleSheet.create({
  row: {
    display: 'flex',
    flexDirection: 'row',
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
})
