import { RootState } from 'src/redux'

export const selectProfile = (state: RootState) => state.profile
export const selectProfileStatus = (state: RootState) => state.profile.status
