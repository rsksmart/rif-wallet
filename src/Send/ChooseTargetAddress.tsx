import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Header1, Paragraph } from '../components/typography'
import Button from '../components/button'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ChooseTargetAddressScreen: React.FC<Interface> = ({ route }) => {
  return (
    <ScrollView>
      <Header1>Transfer Money</Header1>
      <Paragraph>Choose payment wallet</Paragraph>

      <View>
        <Paragraph>To: {route.params.to}</Paragraph>
        <Paragraph>Amount: {route.params.amount}</Paragraph>
        <Paragraph>Token: {route.params.token}</Paragraph>
      </View>

      <View>
        <Paragraph>RSK Savings (0x6A56...3065)</Paragraph>
        <Paragraph>RSK moonwalker.rsk (0xe878....237B)</Paragraph>
        <Paragraph>RSK 0xf20...A8FA</Paragraph>
      </View>

      <View style={styles.section}>
        <Button onPress={() => {}} title="Confirm" />
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
    paddingTop: 5,
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
})

export default ChooseTargetAddressScreen
