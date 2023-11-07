import { RootState } from 'src/redux'

export const selectProfile = (state: RootState) => state.profile
export const selectProfileStatus = ({ profile }: RootState) => profile.status
export const selectUsername = ({ profile }: RootState) => profile.alias
