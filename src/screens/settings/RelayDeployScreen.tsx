import { useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BigNumber, Transaction } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'

import { ScreenWithWallet } from '../types'
import { colors } from 'src/styles'
import { RIF_TOKEN_ADDRESS_TESTNET } from 'src/lib/relay-sdk/helpers'
import { MediumText, SecondaryButton, SemiBoldText } from 'src/components'
import { setWalletIsDeployed } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'src/redux/storeUtils'

export const RelayDeployScreen = ({
  wallet,
  isWalletDeployed,
}: ScreenWithWallet) => {
  const dispatch = useAppDispatch()
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const deploy = async () => {
    setDeployError(null)
    setIsDeploying(true)

    const freePayment = {
      tokenContract: RIF_TOKEN_ADDRESS_TESTNET,
      tokenAmount: BigNumber.from(0),
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: TransactionResponse) => {
        setSmartWalletDeployTx(result)

        result.wait().then((reciept: TransactionReceipt) => {
          if (reciept.status) {
            dispatch(
              setWalletIsDeployed({
                address: wallet.smartWallet.address,
                value: true,
              }),
            )
          } else {
            setDeployError('Tx failed, could not deploy smart wallet')
          }
          setIsDeploying(false)
        })
      })
      .catch((error: Error) => {
        setDeployError(error.toString())
        setIsDeploying(false)
      })
  }

  return (
    <ScrollView style={styles.background}>
      <SemiBoldText style={styles.text}>Deploy Smart Wallet</SemiBoldText>

      {isWalletDeployed && (
        <View>
          <MediumText style={styles.text}>
            Your smart wallet has been deployed!
          </MediumText>
        </View>
      )}

      {!isWalletDeployed && (
        <View>
          <MediumText style={styles.text}>
            Your smart wallet is a smart contract that sits on the RSK network.
            This first step will deploy the contract.
          </MediumText>

          <SecondaryButton
            title="Deploy my Wallet"
            onPress={deploy || isDeploying}
            style={isDeploying ? styles.buttonDisabled : styles.button}
            accessibilityLabel="deploy"
          />

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
