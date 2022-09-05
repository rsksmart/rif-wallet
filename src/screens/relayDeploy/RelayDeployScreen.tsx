import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'
// import { RifRelayLight } from '../../lib/relay-sdk/RifRelayLight'

import { ScreenWithWallet } from '../types'
import {
  deploySmartWallet,
  relayTransaction,
} from '../../lib/relay-sdk/relayOperations'
import { RelayPayment } from '../../lib/relay-sdk/types'

type Interface = {}

// rif relay variables:
// const hubAddress = '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387'
const rifToken = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'

const RelayDeployScreen: React.FC<Interface & ScreenWithWallet> = ({
  wallet,
  isWalletDeployed,
}) => {
  const doIt = async () => deploySmartWallet(wallet)

  const transaction = {
    to: rifToken,
    // send 1 tRIF to jesse:
    data: '0xa9059cbb0000000000000000000000003dd03d7d6c3137f1eb7582ba5957b8a2e26f304a0000000000000000000000000000000000000000000000000de0b6b3a7640000',
    from: wallet.address,
  }

  const handleTransaction = async () => relayTransaction(wallet, transaction)

  const payment: RelayPayment = {
    tokenContract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    tokenAmount: '0',
  }

  const deployNew = async () => wallet.deploySmartWallet(payment)

  return (
    <View>
      <Text>Hello World</Text>

      <PrimaryButton onPress={doIt} disabled={isWalletDeployed}>
        <Text style={styles.buttonText}>Deploy SmartWallet!</Text>
      </PrimaryButton>

      <PrimaryButton onPress={handleTransaction}>
        <Text style={styles.buttonText}>Relay Tranasction</Text>
      </PrimaryButton>

      <PrimaryButton onPress={deployNew}>
        <Text style={styles.buttonText}>Deploy New Method</Text>
      </PrimaryButton>
    </View>
  )
}

const styles = StyleSheet.create({
  buttonText: {
    color: '#fff',
  },
})

export default RelayDeployScreen
