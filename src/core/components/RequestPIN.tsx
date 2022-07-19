import React from 'react'
import { getPin } from '../../storage/PinStore'
import PinContainer from '../../components/PinManager/PinContainer'

interface Interface {
  unlock: () => void
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const checkPin = async (enteredPin: string) => {
    return new Promise((resolve, reject) => {
      getPin().then(storedPin => {
        if (storedPin === enteredPin) {
          unlock()
          resolve('OK')
        } else {
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
    />
  )
}
