import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'

import { ScreenWithWallet } from '../types'
import { deploySmartWallet } from './operations'

type Interface = {}

const RelayDeployScreen: React.FC<Interface & ScreenWithWallet> = ({
  wallet,
}) => {
  const doIt = async () => deploySmartWallet(wallet)

  return (
    <View>
      <Text>Hello World</Text>

      <PrimaryButton onPress={doIt}>
        <Text style={styles.buttonText}>Launch!</Text>
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
