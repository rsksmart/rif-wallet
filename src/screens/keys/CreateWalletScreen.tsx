import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const CreateWalletScreen: React.FC<Interface> = ({ navigation }) => {
  return (
    <ScrollView>
      <View style={styles.section}>
        <Paragraph>
          With your master key (seed phrase) you are able to create as many
          wallets as you need.
        </Paragraph>
      </View>

      <View style={styles.section}>
        <Button
          onPress={() => navigation.navigate('CreateMasterKey')}
          title={'+ Create master key'}
        />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => navigation.navigate('ImportWallet')}
          title={'Import master key'}
        />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  section: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})

export default CreateWalletScreen
