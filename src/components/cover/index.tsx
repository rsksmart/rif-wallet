import React, { useEffect, useState } from 'react'
import { View, AppState, StyleSheet } from 'react-native'

export const Cover = () => {
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState)

  useEffect(() => {
    const subscription = AppState.addEventListener('change', setAppStateVisible)

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <View
      style={appStateVisible !== 'active' ? styles.visible : styles.invisible}
    />
  )
}

const styles = StyleSheet.create({
  visible: {
    height: '100%',
    backgroundColor: '#F5FCFF',
  },
  invisible: {},
})
