import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import CompassIcon from './CompassIcon'
import ContactsIcon from './ContactsIcon'
import WalletIcon from './WalletIcon'

export const AppFooterMenu: React.FC<{}> = () => {
  const navigation = useNavigation()

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <ContactsIcon />
      </View>
      <View style={styles.column}>
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <WalletIcon />
        </TouchableOpacity>
      </View>
      <View style={styles.column}>
        <CompassIcon />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    padding: 10,
    paddingTop: 30,
    display: 'flex',
    flexDirection: 'row',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '33%',
    alignSelf: 'center',
    alignItems: 'center',
  },
})
