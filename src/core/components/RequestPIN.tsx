import { PinManager } from '../../components/PinManager'
import React from 'react'
import { getPin } from '../../storage/PinStore'

interface Interface {
  unlock: () => void
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const onSubmit = async (enteredValue: string) => {
    const storedPin = await getPin()
    if (storedPin === enteredValue) {
      unlock()
      return 'pin confirmed'
    } else {
      return 'incorrect pin'
    }
  }

  return <PinManager title={'Confirm your pin'} handleSubmit={onSubmit} />
}
