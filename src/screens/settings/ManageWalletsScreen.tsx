import React, { useContext } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { Button, Header2, Header3, Paragraph } from '../../components'
import { ScreenWithWallet } from '../types'
import { AppContext } from '../../Context'
import { AddressCopyComponent } from '../../components/copy/AddressCopyComponent'

export interface ManagerWalletScreenProps {
  addNewWallet: any
  switchActiveWallet?: any
}

export const ManageWalletsScreen: React.FC<
  ManagerWalletScreenProps & ScreenWithWallet
> = ({ addNewWallet, switchActiveWallet }) => {
  const { wallets, selectedWallet } = useContext(AppContext)

  return (
    <ScrollView>
      <Header2>Manage Wallets</Header2>
      {Object.keys(wallets).map((address: string, int: number) => {
        const isSelected = selectedWallet === address
        const thisWallet = wallets[address]

        return (
          <View
            key={address}
            style={
              isSelected
                ? { ...styles.addressRow, ...styles.addressRowSelected }
                : styles.addressRow
            }>
            <Paragraph>Account {int.toString()}:</Paragraph>
            <Text>
              EOA Address: <AddressCopyComponent address={address} />
            </Text>
            <Text>
              SW Address:{' '}
              <AddressCopyComponent address={thisWallet.smartWalletAddress} />
            </Text>
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
  addressRowSelected: {
    borderColor: 'green',
  },
})

export default ManageWalletsScreen
