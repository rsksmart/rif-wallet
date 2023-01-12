import React from 'react'
import { StyleProp, StyleSheet, Text, TextStyle } from 'react-native'

interface Props {
  children: React.ReactNode
  testID?: string
  style?: StyleProp<TextStyle>
}

export const Header2 = ({ children, testID }: Props) => (
  <Text style={styles.header2} testID={testID}>
    {children}
  </Text>
)

export const Paragraph = ({ children, testID, style }: Props) => (
  <Text style={[styles.paragraph, style]} testID={testID}>
    {children}
  </Text>
)

export { default as RegularText } from './RegularText'
export { default as MediumText } from './MediumText'
export { default as SemiBoldText } from './SemiBoldText'

const styles = StyleSheet.create({
  header2: {
    fontSize: 36,
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
})
