import React from 'react'
import { View, Text } from 'react-native'
import { NavigationProp } from '../../RootNavigation'

interface Interface {
  navigation: NavigationProp
}

export const SendScreenContainer: React.FC<Interface> = ({ navigation }) => {
  // const navigateToDeployScreen = navigation.navigate.('depl')

  return (
    <View>
      <Text>SendScreenContainer Component</Text>
    </View>
  )
}
