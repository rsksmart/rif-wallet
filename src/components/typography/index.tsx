import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ModalIcon } from '../icons/ModalIcon'

interface Interface {
  children: React.ReactNode
  testID?: string
}

export const Header1: React.FC<Interface> = ({ children, testID }) => (
  <Text style={styles.header1} testID={testID}>
    {children}
  </Text>
)

export const Header2: React.FC<Interface> = ({ children, testID }) => (
  <Text style={styles.header2} testID={testID}>
    {children}
  </Text>
)

export const Header3: React.FC<Interface> = ({ children, testID }) => (
  <Text style={styles.header3} testID={testID}>
    {children}
  </Text>
)

export const Paragraph: React.FC<Interface> = ({ children, testID }) => (
  <Text style={styles.paragraph} testID={testID}>
    {children}
  </Text>
)

export const CompactParagraph: React.FC<Interface> = ({ children, testID }) => (
  <Text style={styles.compactParagraph} testID={testID}>
    {children}
  </Text>
)

export const ModalHeader: React.FC<Interface> = ({ children, testID }) => (
  <View style={styles.modalHeaderWrapper}>
    <ModalIcon color={'#313c3c'} />
    <Text style={styles.modalHeader} testID={testID}>
      {children}
    </Text>
  </View>
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
  header3: {
    fontSize: 26,
    marginBottom: 15,
  },
  modalHeader: {
    marginLeft: 5,
    marginBottom: 3,
    fontSize: 18,
    color: '#313c3c',
  },
  modalHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  paragraph: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 10,
  },
  compactParagraph: {
    fontSize: 18,
    marginTop: 0,
    marginBottom: 2,
  },
})
