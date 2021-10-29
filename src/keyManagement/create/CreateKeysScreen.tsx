import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { ScreenProps } from '../types'

const CreateWalletScreen: React.FC<ScreenProps<'CreateKeys'>> = ({ navigation }) => {
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
          onPress={() => navigation.navigate('NewMasterKey')}
          title={'+ Create master key'}
        />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => navigation.navigate('ImportMasterKey')}
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
