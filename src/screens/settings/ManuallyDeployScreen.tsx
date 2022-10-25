import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction } from 'ethers'
import { ScreenWithWallet } from '../types'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { colors } from '../../styles'
import SecondaryButton from '../../components/button/SecondaryButton'
import { CopyIcon } from '../../components/icons'

export const ManuallyDeployScreen: React.FC<
  ScreenWithWallet & {
    setWalletIsDeployed: (address: string, value?: boolean) => void
  }
> = ({ wallet, isWalletDeployed, setWalletIsDeployed }) => {
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const deploy = async () => {
    setDeployError(null)
    setIsDeploying(true)

    const freePayment = {
      tokenContract: '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
      tokenAmount: '4',
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: Transaction) => {
        setSmartWalletDeployTx(result)
        setWalletIsDeployed(wallet.smartWallet.address, true)
      })
      .catch((error: Error) => {
        setDeployError(error.toString())
        setIsDeploying(false)
      })
  }

  return (
    <ScrollView style={styles.background}>
      <Text style={styles.heading}>Deploy Smart Wallet</Text>

      {isWalletDeployed && (
        <Text style={styles.text}>Your smart wallet has been deployed!</Text>
      )}

      {!isWalletDeployed && (
        <View>
          <Text style={styles.text}>
            Your smart wallet is a smart contract that sits on the RSK network.
            This first step will deploy the contract.
          </Text>

          <SecondaryButton
            onPress={deploy || isDeploying}
            style={isDeploying ? styles.buttonDisabled : styles.button}>
            <Text>Deploy my Wallet</Text>
          </SecondaryButton>

          {isDeploying && <Text style={styles.text}>Deploying...</Text>}

          {smartWalletDeployTx && (
            <TouchableOpacity
              onPress={() =>
                Clipboard.setString(smartWalletDeployTx.hash || '')
              }>
              <Text style={styles.text}>
                {smartWalletDeployTx.hash || ''}
                <CopyIcon />
              </Text>
            </TouchableOpacity>
          )}
          {deployError && <Text style={styles.text}>{deployError}</Text>}
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: colors.darkPurple3,
    paddingHorizontal: 20,
  },
  heading: {
    color: colors.white,
    fontSize: 18,
    marginVertical: 10,
  },
  text: {
    color: colors.white,
    marginVertical: 10,
  },
  button: {
    width: 'auto',
    marginVertical: 10,
  },
  buttonDisabled: {
    width: 'auto',
    backgroundColor: colors.darkPurple4,
  },
})
