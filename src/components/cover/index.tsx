import React, { useEffect, useState } from 'react'
import { View, AppState, StyleSheet, TextInput } from 'react-native'
import { hasPin, getPin } from '../../storage/PinStore'

import { Paragraph } from '../typography'
import { Button } from '../button'
const secondsToLock = 10
export const Cover = () => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState)
  const [backgroundTime, setBackgroundTime] = useState(0)
  const [activeTime, setActiveTime] = useState(0)
  const [locked, setLocked] = useState(false)
  const [inputtedPin, setInputtedPin] = useState('')

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      const secondsSinceEpoch = parseInt(
        (new Date().valueOf() / 1000).toString(),
        10,
      )
      if (nextAppState === 'background') {
        setBackgroundTime(secondsSinceEpoch)
        setInputtedPin('')
      } else if (nextAppState === 'active') {
        setActiveTime(secondsSinceEpoch)
      }
      setAppStateVisible(nextAppState)
    })

    return () => {
      subscription.remove()
    }
  }, [])
  const unlock = (enteredPin: string) => {
    getPin().then(storedPin => {
      if (storedPin === enteredPin) {
        setLocked(false)
        setInputtedPin('')
      }
    })
  }
  useEffect(() => {
    if (activeTime - backgroundTime > secondsToLock) {
      hasPin().then(withPin => {
        if (withPin) {
          setLocked(true)
        }
      })
    }
  }, [activeTime])

  return (
    <>
      <View
        style={
          appStateVisible !== 'active' || locked
            ? styles.visible
            : styles.invisible
        }>
        {locked && (
          <>
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
          </>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  visible: {
    height: '100%',
    backgroundColor: '#F5FCFF',
  },
  invisible: {},
})
