import React from 'react'
import { getPin } from '../../storage/PinStore'
import PinContainer from '../../components/PinManager/PinContainer'
import { useState } from 'react'

interface Interface {
  unlock: () => void
  resetKeysAndPin: () => void
}

export const RequestPIN: React.FC<Interface> = ({
  unlock,
  resetKeysAndPin,
}) => {
  const [resetEnabled, setResetEnabled] = useState<boolean>(false)
  const checkPin = async (enteredPin: string) => {
    return new Promise((resolve, reject) => {
      getPin().then(storedPin => {
        if (storedPin === enteredPin) {
          unlock()
          resolve('OK')
        } else {
          setResetEnabled(true)
          reject('Pin do not match.')
        }
      })
    })
  }

  const pinLength = 4

  return (
    <PinContainer
      pinLength={pinLength}
      key={pinLength}
      onPinSubmit={checkPin}
      resetEnabled={resetEnabled}
      resetKeysAndPin={resetKeysAndPin}
    />
  )
}
