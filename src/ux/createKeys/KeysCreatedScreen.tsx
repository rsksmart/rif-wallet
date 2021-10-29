import { NavigationProp, ParamListBase } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, View, ScrollView } from 'react-native'

import Button from '../../components/button'
import { Paragraph } from '../../components/typography'
import { ScreenProps } from './types'

interface Interface {
  navigation: NavigationProp<ParamListBase>
  route: any
}

const KeysCreatedScreen: React.FC<ScreenProps<'KeysCreated'>> = ({ route, navigation }) => {
  const address = route.params.address

  const navigateToReceive = async () => {
    navigation.navigate('Receive' as any)
  }

  return (
    <ScrollView>
      <View style={styles.sectionCentered}>
        <Paragraph testID="Text.Subtitle">Your new wallet is ready!</Paragraph>
        <Paragraph testID="Text.Address">{address}</Paragraph>
      </View>
      <View style={styles.section}>
        <Button onPress={() => navigation.navigate('Home' as any)} title={'<- Home'} />
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

export default KeysCreatedScreen
