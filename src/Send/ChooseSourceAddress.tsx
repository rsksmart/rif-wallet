import React, { useState } from 'react'
import { StyleSheet, View, ScrollView, TextInput, Picker } from 'react-native'
import { NavigationProp, ParamListBase } from '@react-navigation/native'

import { Header1, Paragraph } from '../components/typography'
import {
  tokensMetadataTestnet,
  tokensMetadataMainnet,
} from '../lib/tokenMetadata'
const isMainnet = false
const metadataTokens = Object.entries(
  isMainnet ? tokensMetadataMainnet : tokensMetadataTestnet,
).map(keyValue => {
  // @ts-ignore
  return { address: keyValue[0], ...keyValue[1] }
})
import Button from '../components/button'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const ChooseSourceAddressScreen: React.FC<Interface> = ({
  route,
  navigation,
}) => {
  const [to, setTo] = useState('')
  const [token, setToken] = useState('')
  const [amount, setAmount] = useState('')
  console.log({ tokensMetadataTestnet })
  return (
    <ScrollView>
      <Header1>Transfer Money</Header1>
      <View style={styles.section}>
        <Paragraph>Enter the amount to send</Paragraph>
      </View>
      <View style={styles.section}>
        <TextInput
          onChangeText={text => setTo(text)}
          value={to}
          placeholder="To"
        />
      </View>

      <View style={styles.section}>
        <TextInput
          onChangeText={text => setAmount(text)}
          value={amount}
          placeholder="Amount"
        />
      </View>

      <View style={styles.section}>
        <Picker
          selectedValue={token}
          style={{ height: 50, width: 150 }}
          onValueChange={(itemValue, itemIndex) => setToken(itemValue)}>
          {metadataTokens.map(token => (
            <Picker.Item label={token.symbol} value={token.symbol} />
          ))}
        </Picker>
      </View>

      <View style={styles.section}>
        <Button
          onPress={() =>
            navigation.navigate('ChooseTargetAddressScreen', {
              amount,
              to,
              token,
            })
          }
          title="Next"
        />
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

export default ChooseSourceAddressScreen
