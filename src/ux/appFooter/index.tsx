import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ContactsIcon, WalletIcon, CompassIcon } from '../../components/icons'

export const AppFooterMenu: React.FC<{}> = () => {
  const navigation = useNavigation()

  // @ts-ignore
  const currentRoute = navigation.getCurrentRoute()

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
