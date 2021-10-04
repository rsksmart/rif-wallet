import React from 'react'
import { StyleSheet, Text } from 'react-native'

interface Interface {
  children: React.ReactNode
}

export const Header1: React.FC<Interface> = ({ children }) => (
  <Text style={styles.header1}>{children}</Text>
)

export const Header2: React.FC<Interface> = ({ children }) => (
  <Text style={styles.header2}>{children}</Text>
)

export const Paragraph: React.FC<Interface> = ({ children }) => (
  <Text style={styles.paragraph}>{children}</Text>
)

const styles = StyleSheet.create({
  header1: {
    fontSize: 42,
    marginBottom: 15,
  },
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
