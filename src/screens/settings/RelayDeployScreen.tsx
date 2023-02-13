import { useCallback, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BigNumber, Transaction } from 'ethers'
import {
  TransactionResponse,
  TransactionReceipt,
} from '@ethersproject/abstract-provider'

import { colors } from 'src/styles'
import { MediumText, SecondaryButton, SemiBoldText } from 'src/components'
import { setWalletIsDeployed } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'src/redux/storeUtils'
import { defaultChainType, getTokenAddress } from 'core/config'

import { ScreenWithWallet } from '../types'
import { ChainTypeEnum } from 'src/redux/slices/settingsSlice/types'

export const RelayDeployScreen = ({
  wallet,
  isWalletDeployed,
}: ScreenWithWallet) => {
  const dispatch = useAppDispatch()
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const updateErrorState = useCallback((error: string | null) => {
    setDeployError(error)
  }, [])

  const deploy = async () => {
    updateErrorState(null)
    setIsDeploying(true)
    const freePayment = {
      tokenContract: getTokenAddress(
        defaultChainType === ChainTypeEnum.MAINNET ? 'RIF' : 'tRIF',
        defaultChainType,
      ),
      tokenAmount: BigNumber.from(0),
    }

    wallet
      .deploySmartWallet(freePayment)
      .then((result: TransactionResponse) => {
        setSmartWalletDeployTx(result)

        result.wait().then((receipt: TransactionReceipt) => {
          if (receipt.status) {
            dispatch(
              setWalletIsDeployed({
                address: wallet.smartWallet.address,
                value: true,
              }),
            )
          } else {
            updateErrorState('Tx failed, could not deploy smart wallet')
          }
          setIsDeploying(false)
        })
      })
      .catch((error: Error) => {
        updateErrorState(error.toString())
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
