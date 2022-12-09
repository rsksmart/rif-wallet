import Clipboard from '@react-native-community/clipboard'
import { BigNumber, Transaction } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native'

import { CopyIcon } from 'components/icons'
import { PrimaryButton } from 'components/button/PrimaryButton'
import { SecondaryButton } from 'components/button/SecondaryButton'
import { useAppDispatch } from 'store/storeUtils'
import { setWalletIsDeployed } from 'store/slices/settingsSlice'
import { ScreenWithWallet } from '../types'
import { colors, grid } from '../../styles'

export const ManuallyDeployScreen = ({
  wallet,
  isWalletDeployed,
}: ScreenWithWallet) => {
  const dispatch = useAppDispatch()
  const [eoaBalance, setEoaBalance] = useState<BigNumber>(BigNumber.from(0))
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [isDeployed, setIsDeployed] = useState<boolean>(isWalletDeployed)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const getInfo = useCallback(
    () => wallet.smartWallet.signer.getBalance().then(setEoaBalance),
    [wallet.smartWallet.signer],
  )

  useEffect(() => {
    getInfo()
  }, [getInfo])

  const deploy = async () => {
    setDeployError(null)
    setIsDeploying(true)

    try {
      const txPromise = await wallet.smartWalletFactory.deploy()
      setSmartWalletDeployTx(txPromise)
      await txPromise.wait()
      await wallet.smartWalletFactory.isDeployed().then(async result => {
        setIsDeployed(result)
        dispatch(
          setWalletIsDeployed({
            address: wallet.smartWallet.address,
            value: result,
          }),
        )
        setIsDeploying(false)
      })
    } catch (error) {
      if (error instanceof Error) {
        setDeployError(error.toString())
      }
      setIsDeploying(false)
    }
  }

  const hasBalance = eoaBalance.toString() !== '0'

  return (
    <ScrollView style={styles.background}>
      <Text style={styles.heading}>Deploy Smart Wallet</Text>

      {isDeployed && (
        <Text style={styles.text}>Your smart wallet has been deployed!</Text>
      )}

      {!isDeployed && (
        <View>
          <Text style={styles.text}>
            This is a temporary step that is needed before RIF Relay Server is
            ready.
          </Text>
          <Text style={styles.heading}>Step 1: Fund your EOA account</Text>
          <View>
            <Text style={styles.text}>
              Fund your Externally Owned Account (EOA) with rBTC. Copy your
              address below and paste it in the rBTC Faucet.
            </Text>

            <View style={grid.row}>
              <View style={grid.column3}>
                <Text style={styles.text}>Address:</Text>
              </View>

              <View style={grid.column8}>
                <Text style={styles.text}>{wallet.address}</Text>
              </View>
              <View style={grid.column1}>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => Clipboard.setString(wallet.address)}
                  accessibilityLabel="copy">
                  <CopyIcon width={25} height={25} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={grid.row}>
              <View style={grid.column3}>
                <Text style={styles.text}>Balance:</Text>
              </View>
              <View style={grid.column8}>
                <Text style={styles.text}>
                  {eoaBalance ? eoaBalance.toString() : '0'}
                </Text>
              </View>
            </View>

            {!hasBalance && (
              <SecondaryButton
                onPress={() => Linking.openURL('https://faucet.rsk.co/')}
                style={styles.button}
                title="Open the RBTC Faucet in your browser"
                accessibilityLabel="faucet"
              />
            )}
          </View>

          <Text style={styles.heading}>Step 2: Deploy the wallet</Text>
          <PrimaryButton
            disabled={!hasBalance}
            onPress={deploy || isDeploying}
            style={!hasBalance ? styles.buttonDisabled : styles.button}
            title="Deploy Wallet"
            accessibilityLabel="deploy"
          />

          {isDeploying && <Text style={styles.text}>Deploying...</Text>}

          {smartWalletDeployTx && (
            <TouchableOpacity
              onPress={() =>
                Clipboard.setString(smartWalletDeployTx.hash || '')
              }
              accessibilityLabel="explorer">
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
