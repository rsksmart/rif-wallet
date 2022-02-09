import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type Props = {
  title: string
}

export const Section: React.FC<Props> = ({ children, title }) => {
  return (
    <View testID={title} style={styles.root}>
      <Text style={styles.title}>{title}</Text>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  root: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
})
