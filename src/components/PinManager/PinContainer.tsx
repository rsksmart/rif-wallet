import React, { useState } from 'react'
import PinScreen from './PinScreen'
import { PinContainerType } from './PinScreen/PinScreen'

const PinContainer: React.FC<PinContainerType> = ({
  pinLength = 4,
  onPinSubmit,
  PinScreenComponent = PinScreen,
}) => {
  const createPinArray = React.useCallback(
    length => Array.from({ length }, () => ''),
    [],
  )
  const defaultPinArray = React.useMemo(
    () => createPinArray(pinLength),
    [pinLength],
  )
  const [pin, setPin] = useState<Array<string>>(defaultPinArray)
  const [position, setPosition] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const onPinDigitAdd = (numberTouched: string) => {
    const newPin = [...pin]
    newPin[position] = numberTouched
    setPin(newPin)
    if (position === pinLength - 1) {
      onLastPinDigitAdded(newPin)
    } else {
      const newPosition = position + 1
      setPosition(newPosition)
    }
  }

  const onPinReset = () => {
    setPin(defaultPinArray)
    setPosition(0)
  }

  const onLastPinDigitAdded = (enteredPin: Array<string>) => {
    const parsedPin = enteredPin.join('')
    setError(null)
    onPinSubmit(parsedPin).catch((errorProm: any) => {
      setError(errorProm.toString())
      onPinReset()
    })
  }

  const onPinDigitDelete = () => {
    const newPin = [...pin]
    const oldPosition = position > 0 ? position - 1 : 0
    newPin[oldPosition] = ''
    setPin(newPin)
    setPosition(oldPosition)
  }

  return (
    <PinScreenComponent
      key={pinLength}
      pin={pin}
      onKeypadPress={onPinDigitAdd}
      onKeypadDelete={onPinDigitDelete}
      error={error}
    />
  )
}

export default PinContainer
