import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, CopyComponent, Header2, Header3 } from '../../components'
import { ScreenWithWallet } from '../types'
import { AppContext } from '../../Context'

interface Interface {
  addNewWallet: any
  switchActiveWallet?: any
}

export const ManageWalletsScreen: React.FC<Interface & ScreenWithWallet> = ({
  addNewWallet,
  switchActiveWallet,
}) => {
  const { wallets, selectedWallet } = useContext(AppContext)

  return (
    <ScrollView>
      <Header2>Manage Wallets</Header2>
      {Object.keys(wallets).map((address: string, int: number) => {
        const isSelected = selectedWallet === address
        return (
          <View key={address} style={styles.addressRow}>
            <Text>Account {int.toString()}:</Text>
            <CopyComponent value={address} />
            {isSelected && <Text>SELECTED</Text>}
            {!isSelected && (
              <Button
                onPress={() => switchActiveWallet(address)}
                title="Switch to this wallet"
              />
            )}
          </View>
        )
      })}

      <Header3>Add Wallet</Header3>
      <Button onPress={addNewWallet} title="Add Wallet" />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  addressRow: {
    padding: 10,
    margin: 10,
    borderWidth: 1,
  },
})

export default ManageWalletsScreen
