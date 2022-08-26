import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'
import { RifRelayLight } from '../../lib/relay-sdk/RifRelayLight'

import { ScreenWithWallet } from '../types'
import { deploySmartWallet, relayTransaction } from './operations'

type Interface = {}

// rif relay variables:
const hubAddress = '0x66Fa9FEAfB8Db66Fe2160ca7aEAc7FC24e254387'

const RelayDeployScreen: React.FC<Interface & ScreenWithWallet> = ({
  wallet,
}) => {
  const doIt = async () => deploySmartWallet(wallet)

  const handleTransaction = async () => relayTransaction(wallet)

  const relayClient = new RifRelayLight(wallet, hubAddress)
  const handleTransactionPackage = async () =>
    await relayClient.createRelayRequest()

  return (
    <View>
      <Text>Hello World</Text>

      <PrimaryButton onPress={doIt}>
        <Text style={styles.buttonText}>Deploy SmartWallet!</Text>
      </PrimaryButton>

      <PrimaryButton onPress={handleTransaction}>
        <Text style={styles.buttonText}>Relay Tranasction</Text>
      </PrimaryButton>

      <PrimaryButton onPress={handleTransactionPackage}>
        <Text style={styles.buttonText}>Relay Transaction Light</Text>
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
