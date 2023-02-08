import { useMemo } from 'react'
import { getTokenColor } from './tokenColor'
import { sharedColors } from 'shared/constants'

export const useTokenColor = (selected: boolean, symbol: string) => {
  return useMemo(
    () => (selected ? getTokenColor(symbol) : sharedColors.darkGray),
    [selected, symbol],
  )
}
