import React from 'react'
import { savePin } from '../../storage/PinStore'
import { PinManager } from '../../components/PinManager'

interface Interface {
  onPinCreated: () => Promise<void>
}

export const CreatePinScreen: React.FC<Interface> = ({ onPinCreated }) => {
  const onSubmit = async (enteredValue: string) => {
    await savePin(enteredValue)
    await onPinCreated()
    return 'Pin Created'
  }
  return <PinManager title={'Set your pin'} handleSubmit={onSubmit} />
}
