import React from 'react'
import { View, StyleSheet } from 'react-native'
import CompassIcon from './CompassIcon'
import ContactsIcon from './ContactsIcon'
import WalletIcon from './WalletIcon'

export const AppFooterMenu: React.FC<{}> = () => {
  return (
    <View style={styles.row}>
      <View style={styles.column}>
        <ContactsIcon />
      </View>
      <View style={styles.column}>
        <WalletIcon />
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
