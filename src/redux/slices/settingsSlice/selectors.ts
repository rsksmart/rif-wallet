import { RootState } from 'store/store'

export const selectTopColor = (state: RootState) => state.settings.topColor
