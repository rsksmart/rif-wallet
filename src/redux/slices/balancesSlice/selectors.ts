import { RootState } from 'src/redux'

export const selectBalances = ({ balances }: RootState) =>
  balances.tokenBalances

export const selectTotalUsdValue = ({ balances }: RootState) =>
  balances.totalUsdBalance
