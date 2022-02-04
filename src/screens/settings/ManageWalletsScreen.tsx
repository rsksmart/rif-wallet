import React from 'react'
import { Text, View } from 'react-native'
import { Button, CopyComponent, Header2, Header3 } from '../../components'
import { ScreenWithWallet } from '../types'

interface Interface {
  addNewWallet: any
}

export const ManageWalletsScreen: React.FC<Interface & ScreenWithWallet> = ({
  wallet,
  addNewWallet,
}) => {
  return (
    <View>
      <Header2>Manage Wallets</Header2>
      <Header3>Current Wallet Info</Header3>
      <Text>Smart Wallet Address:</Text>
      <CopyComponent value={wallet.smartWalletAddress} />
      <Text>EOA Address:</Text>
      <CopyComponent value={wallet.address} />

      <Header3>Switch Wallets</Header3>
      <Header3>Add Wallet</Header3>
      <Button onPress={addNewWallet} title="Create New Wallet" />
    </View>
  )
}

export default ManageWalletsScreen
