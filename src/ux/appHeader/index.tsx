import React from 'react'
import { useNavigation } from '@react-navigation/native'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'

interface Interface {
  navigation?: any
  address: string
}

export const AppHeader: React.FC<Interface> = ({ address }) => {
  const navigation = useNavigation()
  const openMenu = () => navigation.navigate('Receive')

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <AddressCopyComponent address={address} />
      </View>
      <View style={styles.column}>
        <TouchableOpacity onPress={openMenu}>
        <Text style={styles.text}>Menu</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '50%',
  },
  text: {
    textAlign: 'right',
  },
})
