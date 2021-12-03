import React, { useState } from 'react'
import { View, TextInput, SafeAreaView, StatusBar } from 'react-native'
import { getPin } from '../../storage/PinStore'

import { Paragraph } from '../typography'
import { Button } from '../button'
import { shareStyles } from '../sharedStyles'

interface Interface {
  unlock: () => void
}

export const RequestPIN: React.FC<Interface> = ({ unlock }) => {
  const [inputtedPin, setInputtedPin] = useState('')

  const checkPin = (enteredPin: string) =>
    getPin().then(storedPin => storedPin === enteredPin && unlock())

  return (
    <SafeAreaView>
      <StatusBar />
      <View style={shareStyles.coverAllScreen}>
        <Paragraph>Enter your pin to unlock the app</Paragraph>
        <View>
          <TextInput
            onChangeText={pin => setInputtedPin(pin)}
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
          />
        </View>
      </View>
    </SafeAreaView>
  )
}
