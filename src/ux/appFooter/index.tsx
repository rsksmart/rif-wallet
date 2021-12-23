import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { ContactsIcon, WalletIcon, CompassIcon } from '../../components/icons'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <ContactsIcon color="#D1D1D1" />
      </View>
      <View style={styles.column}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <WalletIcon
            color={currentScreen === 'Home' ? '#5D5E5E' : '#D1D1D1'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.column}>
        <CompassIcon color="#D1D1D1" />
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
