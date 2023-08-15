import { RootState } from 'store/store'

export const selectCurrentTransaction = ({ currentTransaction }: RootState) =>
  currentTransaction
