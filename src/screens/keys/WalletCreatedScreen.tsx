import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { useSelectedWallet } from '../../Context'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const WalletCreatedScreen: React.FC<Interface> = ({ route, navigation }) => {
  const wallet = useSelectedWallet()

  const navigateToReceive = async () => {
    navigation.navigate('Receive')
  }

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph testID="Text.Subtitle">Your new wallet is ready!</Paragraph>
        <Paragraph testID="Text.Address">{wallet.address}</Paragraph>
      </View>
      <View style={styles.section}>
        <Button onPress={() => navigation.navigate('Home')} title={'<- Home'} />
      </View>
      <View style={styles.section}>
        <Button
          onPress={() => {
            navigateToReceive()
          }}
          title={'Receive money'}
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
  },
  sectionCentered: {
    paddingTop: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    alignItems: 'center',
  },
})

export default WalletCreatedScreen
