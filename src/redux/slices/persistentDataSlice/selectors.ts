import { RootState } from 'src/redux'

export const selectKeysExist = ({ persistentData }: RootState) =>
  persistentData.keysExist
