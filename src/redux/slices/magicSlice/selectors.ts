import { RootState } from 'store/index'

export const selectMagicIsLoading = ({ magic }: RootState) => magic.loading
