import SDK from '@jessgusclark/rsk-multi-token-sdk'
import { ethers } from 'ethers'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'
import { colors } from '../../styles'
import { ScreenWithWallet } from '../types'

export const RelayDeploySreen: React.FC<ScreenWithWallet> = ({ wallet }) => {
  const doIt = async () => {
    console.log('doing it', wallet)

    /*
    const provider = new ethers.providers.JsonRpcProvider(
      'https://public-node.rsk.co',
    )
    */
    const signer = wallet.smartWallet.signer

    const provider = wallet.provider
    console.log('starting...')
    if (provider) {
      // @ts-ignore
      SDK.create(provider, { chainId: 31 })
        .then((sdk: any) => {
          console.log('success', sdk)
        })
        .catch(console.log)
    }
  }

  return (
    <View style={styles.parent}>
      <Text>Let's Relay!!</Text>

      <PrimaryButton onPress={doIt}>
        <Text style={styles.button}>Deploy</Text>
      </PrimaryButton>
    </View>
  )
}

const styles = StyleSheet.create({
  parent: {
    height: '100%',
    backgroundColor: colors.white,
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  button: {
    color: colors.white,
  },
})
