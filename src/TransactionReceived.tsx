import React, { useState } from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Header1, Paragraph } from './components/typography'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const TransactionReceived: React.FC<Interface> = ({ route }) => {
  return (
    <ScrollView>
      <View style={styles.section}>
        <Paragraph>Transaction Hash: {route.params.txHash}</Paragraph>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  safeView: {
    height: '100%',
  },
  screen: {
    paddingRight: 15,
    paddingLeft: 15,
  },
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default TransactionReceived
