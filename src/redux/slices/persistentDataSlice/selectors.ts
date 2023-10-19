import { RootState } from 'src/redux'

export const selectKeysExist = ({ persistentData }: RootState) =>
  persistentData.keysExist

export const selectPin = ({ persistentData }: RootState) => persistentData.pin
