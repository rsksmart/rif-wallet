import React from 'react'
import { savePin } from '../../storage/PinStore'
import { PinManager } from '../../components/PinManager'

interface Interface {
  route: any
  navigation: any
}

export const CreatePinScreen: React.FC<Interface> = ({ route, navigation }) => {
  const mnemonic = route.params.mnemonic
  const onSubmit = async (enteredValue: string) => {
    await savePin(enteredValue)
    navigation.navigate('KeysCreated', { mnemonic: mnemonic })
    return 'pin created'
  }
  return <PinManager title={'Set your pin'} handleSubmit={onSubmit} />
}
