import { useMemo } from 'react'
import { StyleSheet } from 'react-native'
import { getTokenColor } from './tokenColor'

export const useContainerStyles = (selected: boolean, symbol: string) => {
  return useMemo(
    () => ({
      ...styles.container,
      backgroundColor: selected
        ? getTokenColor(symbol)
        : 'rgba(0, 134, 255, .25)',
    }),
    [selected, symbol],
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
})
