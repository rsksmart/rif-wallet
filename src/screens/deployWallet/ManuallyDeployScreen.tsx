import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'
import { ScreenWithWallet } from '../types'
import { Linking, StyleSheet, View } from 'react-native'
import { colors } from '../../styles'
import SecondaryButton from '../../components/button/SecondaryButton'
import { RIF_TOKEN_ADDRESS_TESTNET } from '../../lib/relay-sdk/helpers'
import { MediumText, SemiBoldText } from '../../components'

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
      tokenContract: RIF_TOKEN_ADDRESS_TESTNET,
      tokenAmount: 0,
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: TransactionResponse) => {
        setSmartWalletDeployTx(result)

        result.wait().then((reciept: TransactionReceipt) => {
          reciept.status
            ? setWalletIsDeployed(wallet.smartWallet.address, true)
            : setDeployError('Tx failed, could not deploy smart wallet')

          setIsDeploying(false)
        })
      })
      .catch((error: Error) => {
        setDeployError(error.toString())
        setIsDeploying(false)
      })
  }

  const openRifFaucet = () => Linking.openURL('https://faucet.rifos.org/')

  return (
    <ScrollView style={styles.background}>
      <SemiBoldText style={styles.text}>Deploy Smart Wallet</SemiBoldText>

      {isWalletDeployed && (
        <View>
          <MediumText style={styles.text}>
            Your smart wallet has been deployed!
          </MediumText>

          <SecondaryButton onPress={openRifFaucet} style={styles.button}>
            <MediumText style={styles.text}>Open the RIF Faucet</MediumText>
          </SecondaryButton>
        </View>
      )}

      {!isWalletDeployed && (
        <View>
          <MediumText style={styles.text}>
            Your smart wallet is a smart contract that sits on the RSK network.
            This first step will deploy the contract.
          </MediumText>

          <SecondaryButton
            onPress={deploy || isDeploying}
            style={isDeploying ? styles.buttonDisabled : styles.button}>
            <MediumText>Deploy my Wallet</MediumText>
          </SecondaryButton>

          {isDeploying && (
            <View>
              <MediumText style={styles.text}>Deploying...</MediumText>
              <MediumText style={styles.text}>Status: Pending</MediumText>
              <MediumText style={styles.text}>
                Hash: {smartWalletDeployTx?.hash}
              </MediumText>
            </View>
          )}

          {deployError && (
            <MediumText style={styles.text}>{deployError}</MediumText>
          )}
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
