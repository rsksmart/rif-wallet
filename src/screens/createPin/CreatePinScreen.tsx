import { useCallback } from 'react'
import { navigationContainerRef } from '../../core/Core'
import { PinManager } from '../../components/PinManager'

interface Props {
  createPin: (newPin: string) => void
}

export const CreatePinScreen = ({ createPin }: Props) => {
  const handleSubmit = useCallback((enteredPin: string) => {
    createPin(enteredPin)
    navigationContainerRef.navigate('Home')
  }, [])

  return <PinManager title={'Set your pin'} handleSubmit={handleSubmit} />
}
