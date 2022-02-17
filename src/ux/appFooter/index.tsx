import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { ContactsIcon, WalletIcon, CompassIcon } from '../../components/icons'
import { colors } from '../../styles/colors'

export const AppFooterMenu: React.FC<{ currentScreen: string }> = ({
  currentScreen,
}) => {
  const navigation = useNavigation()

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Contacts' as never)}
          style={styles.button}>
          <ContactsIcon
            color={currentScreen === 'Contacts' ? '#5D5E5E' : '#D1D1D1'}
            width={24}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.column}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Home' as never)}
          style={styles.button}>
          <WalletIcon
            color={currentScreen === 'Home' ? '#5D5E5E' : '#D1D1D1'}
            width={24}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.column}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Dapps' as never)}
          style={styles.button}>
          <CompassIcon
            color={currentScreen === 'Dapps' ? '#5D5E5E' : '#D1D1D1'}
            width={24}
          />
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
  button: {
    padding: 10,
    width: 44,
    height: 44,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    display: 'flex',
    paddingRight: 5,
    width: '33%',
    alignSelf: 'center',
    alignItems: 'center',
  },
})
