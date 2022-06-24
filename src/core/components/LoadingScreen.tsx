import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native'
import { shareStyles } from '../../components/sharedStyles'

export const LoadingScreen = () => {
  const dotActive = {
    ...styles.dot,
    backgroundColor: '#d4e0ff',
  }
  const totalDots = 3
  const [activeDot, setActiveDot] = useState<number>(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDot(prev => (prev === totalDots ? 1 : prev + 1))
    }, 450)

    return () => clearInterval(timer)
  }, [])

  return (
    <View style={{ ...shareStyles.coverAllScreen, ...styles.container }}>
      <View style={styles.dotContainer}>
        {Array.from({ length: 3 }).map((_, i) => (
          <View key={i} style={activeDot === i + 1 ? dotActive : styles.dot} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#08003a',
    display: 'flex',
  },
  dotContainer: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  dot: {
    display: 'flex',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#5025ff',
    marginHorizontal: 18,
  },
})
