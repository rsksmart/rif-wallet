import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

interface Props {
  children: React.ReactNode
  testID?: string
  style?: StyleProp<TextStyle>
}

export const Paragraph = ({ children, testID, style }: Props) => (
  <Text style={[styles.paragraph, style]} testID={testID}>
    {children}
  </Text>
)

export { RegularText } from './RegularText'
export { default as MediumText } from './MediumText'
export { default as SemiBoldText } from './SemiBoldText'

const styles = StyleSheet.create({
  paragraph: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
})
