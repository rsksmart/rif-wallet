import React, { useEffect, useRef, useState } from 'react'
import { View, AppState, TextInput } from 'react-native'
import { hasPin, getPin } from '../../storage/PinStore'

import { Paragraph } from '../typography'
import { Button } from '../button'
import { shareStyles } from '../sharedStyles'

const millisecondsToLock = 10000

let timer: NodeJS.Timeout

export const RequestPIN = () => {
  const [locked, setLocked] = useState(true)
  const [inputtedPin, setInputtedPin] = useState('')

  const timerRef = useRef<NodeJS.Timeout>(timer)

  const unlock = (enteredPin: string) => {
    getPin().then(storedPin => {
      if (storedPin === enteredPin) {
        setLocked(false)
        setInputtedPin('')
      }
    })
  }

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      hasPin().then(withPin => {
        if (withPin) {
          if (nextAppState === 'active') {
            if (!!timerRef.current) {
              clearTimeout(timerRef.current)
            }
          }

          if (nextAppState !== 'active') {
            const newTimer = setTimeout(() => {
              setInputtedPin('')
              setLocked(true)

            }, millisecondsToLock)

            timerRef.current = newTimer
          }
        } else {
          setLocked(false)
        }
      })
    })
    return () => {
      subscription.remove()
    }
  }, [])

  return <>
    {locked && <View style={shareStyles.coverAllScreen}>
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
          onPress={() => unlock(inputtedPin)}
          title="Unlock"
          testID="Next.Button"
        />
      </View>
    </View>
    }
  </>
}
