import React, { useCallback } from 'react'
import { navigationContainerRef } from '../../core/Core'
import { PinManager } from '../../components/PinManager'

interface Interface {
  createPin: (newPin: string) => Promise<void>
}

export const CreatePinScreen: React.FC<Interface> = ({ createPin }) => {
  const handleSubmit = useCallback((enteredPin: string) => {
    createPin(enteredPin)
    navigationContainerRef.navigate('Home')
  }, [])

  return <PinManager title={'Set your pin'} handleSubmit={handleSubmit} />
}
