import React from 'react'
import { savePin } from '../../storage/PinStore'
import { PinManager } from '../../components/PinManager'

interface Interface {
  unlock: () => void
  route: any
  navigation: any
}

export const CreatePinScreen: React.FC<Interface> = ({ route, navigation }) => {
  const mnemonic = route.params.mnemonic
  console.log({ mnemonic })
  const onSubmit = async (enteredValue: string) => {
    await savePin(enteredValue)
    navigation.navigate('KeysCreated', { mnemonic: mnemonic })
    return 'Pin Created'
  }
  return <PinManager title={'Set your pin'} handleSubmit={onSubmit} />
}
