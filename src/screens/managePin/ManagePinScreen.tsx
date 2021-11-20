import React, { useState, useEffect } from 'react'
import { View, TextInput, ScrollView } from 'react-native'
import { Button } from '../../components'
import { Trans } from 'react-i18next'
import { Paragraph } from '../../components'
import { exists, set, remove, STORAGE_KEYS } from '../../storage/SecureStorage'

export const ManagePinScreen = () => {
  const [pin, setPin] = useState('')
  const [pinSaved, setPinSaved] = useState(false)
  useEffect(() => {
    const callStorage = async () => {
      const pinSet = await exists(STORAGE_KEYS.pin)
      setPinSaved(pinSet || false)
      return pinSet
    }

    callStorage().then(pinSet => console.log(pinSet))
  }, [])

  const saveMyPin = (newPin: string) => {
    setPinSaved(true)
    set(STORAGE_KEYS.pin, newPin)
  }
  const removeMyPin = () => {
    setPinSaved(false)
    remove(STORAGE_KEYS.pin)
  }
  return (
    <ScrollView>
      {pinSaved && (
        <View>
          <Paragraph>
            <Trans>Your pin is set</Trans>
          </Paragraph>
          <Button onPress={() => removeMyPin()} title="Delete your Pin" />
        </View>
      )}

      {!pinSaved && (
        <>
          <Paragraph>Set your pin</Paragraph>
          <View>
            <TextInput
              onChangeText={setPin}
              value={pin}
              placeholder={'Pin'}
              testID={'To.Input'}
              keyboardType="numeric"
            />
          </View>

          <View>
            <Button
              onPress={() => saveMyPin(pin)}
              title="Save"
              testID="Next.Button"
            />
          </View>
        </>
      )}
    </ScrollView>
  )
}
