import React from 'react'
import { PinManager } from '../../components/PinManager'

interface Interface {
  createPin: (newPin: string) => Promise<void>
}

export const CreatePinScreen: React.FC<Interface> = ({ createPin }) => {
  const onSubmit = async (enteredValue: string) => {
    await createPin(enteredValue)
    return 'Pin Created'
  }
  return <PinManager title={'Set your pin'} handleSubmit={createPin} />
}
