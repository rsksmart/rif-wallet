import React, { useEffect, useState } from 'react'
import { View, AppState, StyleSheet } from 'react-native'
import { RequestPIN } from '../requestPin'
import { shareStyles } from '../sharedStyles'

export const Cover = () => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppStateVisible)

    return () => {
      subscription.remove()
    }
  }, [])

  return <View
    style={appStateVisible !== 'active' ? shareStyles.coverAllScreen : styles.invisible}
  />
}

const styles = StyleSheet.create({
  invisible: {},
})
