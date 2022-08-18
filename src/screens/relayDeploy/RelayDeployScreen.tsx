import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'

import { ScreenWithWallet } from '../types'
import { deploySmartWallet, relayTransaction } from './operations'

type Interface = {}

const RelayDeployScreen: React.FC<Interface & ScreenWithWallet> = ({
  wallet,
}) => {
  const doIt = async () => deploySmartWallet(wallet)

  const handleTransaction = async () => relayTransaction(wallet)

  return (
    <View>
      <Text>Hello World</Text>

      <PrimaryButton onPress={doIt}>
        <Text style={styles.buttonText}>Deploy SmartWallet!</Text>
      </PrimaryButton>

      <PrimaryButton onPress={handleTransaction}>
        <Text style={styles.buttonText}>Relay Tranasction</Text>
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
