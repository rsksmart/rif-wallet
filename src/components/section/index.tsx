import React from 'react'
import { StyleSheet, View } from 'react-native'
import { RegularText } from '../typography'

type Props = {
  title: string
}

export const Section: React.FC<Props> = ({ children, title }) => {
  return (
    <View testID={title} style={styles.root}>
      <RegularText style={styles.title}>{title}</RegularText>
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
