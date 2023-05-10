import { RootState } from 'src/redux'

export const selectTransactions = ({ transactions }: RootState) =>
  transactions.transactions

export const selectTransactionsLoading = ({ transactions }: RootState) =>
  transactions.loading
