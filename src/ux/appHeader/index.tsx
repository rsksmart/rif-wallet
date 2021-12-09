import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'
import { useSelectedWallet } from '../../Context'

export const AppHeader: React.FC<{}> = () => {
  const { wallet } = useSelectedWallet()
  const openMenu = () => console.log('@todo') // navigation.navigate('Receive')

  return (
    <View style={styles.row}>
      <View style={styles.column}>
        {wallet && <AddressCopyComponent address={wallet.smartWalletAddress} />}
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
