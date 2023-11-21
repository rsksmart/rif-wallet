import { RootState } from 'src/redux'

export const selectTransactions = ({ transactions }: RootState) =>
  transactions.transactions

export const selectTransactionsLoading = ({ transactions }: RootState) =>
  transactions.loading

export const selectCurrentTransaction = ({ transactions }: RootState) =>
  transactions.currentTransaction
