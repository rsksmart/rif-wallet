import { RootState } from 'store/store'

export const selectSeedlessLoading = ({ seedless }: RootState) =>
  seedless.loading
