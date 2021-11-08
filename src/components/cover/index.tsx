import React, { useEffect, useState } from 'react'
import { View, AppState, Text, StyleSheet } from 'react-native'
interface Interface {
  reason?: string
}

export const Cover: React.FC<Interface> = ({}) => {
  const [appStateVisible, setAppStateVisible] = useState('active')
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log(nextAppState)
      setAppStateVisible(nextAppState)
    })

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
