import React, { useState } from 'react'
import { View, TextInput } from 'react-native'
import { getPin } from '../../storage/PinStore'

import { Paragraph } from '../typography'
import { Button } from '../button'
import { shareStyles } from '../sharedStyles'

interface Interface {
  unlock: () => void
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const [inputtedPin, setInputtedPin] = useState('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const checkPin = (enteredPin: string) => {
    setError(null)
    setIsLoading(true)

    getPin().then(storedPin => {
      if (storedPin === enteredPin) {
        return unlock()
      }
      setIsLoading(false)
      setError('incorrect pin')
    })
  }

  return (
    <View style={shareStyles.coverAllScreen}>
      <Paragraph>Enter your pin to unlock the app</Paragraph>
      <View>
        <TextInput
          onChangeText={pin => !isLoading && setInputtedPin(pin)}
          value={inputtedPin}
          placeholder={'Pin'}
          testID={'To.Input'}
          keyboardType="numeric"
        />
      </View>

      <View>
        <Button
          onPress={() => checkPin(inputtedPin)}
          title="Unlock"
          testID="Next.Button"
          disabled={isLoading}
        />
      </View>
      {error && <Paragraph>{error}</Paragraph>}
    </View>
  )
}
