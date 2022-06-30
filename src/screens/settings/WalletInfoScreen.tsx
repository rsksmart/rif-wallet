import React, { useEffect, useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction, BigNumber } from 'ethers'
import { ScreenWithWallet } from '../types'
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Clipboard from '@react-native-community/clipboard'
import { colors, grid } from '../../styles'
import SecondaryButton from '../../components/button/SecondaryButton'
import { CopyIcon } from '../../components/icons'

export const WalletInfoScreen: React.FC<ScreenWithWallet> = ({
  wallet,
  isWalletDeployed,
}) => {
  const [eoaBalance, setEoaBalance] = useState<BigNumber>(BigNumber.from(0))
  const [isDeploying, setIsDeploying] = useState<boolean>(false)
  const [deployError, setDeployError] = useState<string | null>(null)
  const [isDeployed, setIsDeployed] = useState<boolean>(isWalletDeployed)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  useEffect(() => {
    getInfo()
  }, [])

  const getInfo = () =>
    wallet.smartWallet.signer.getBalance().then(setEoaBalance)

  const deploy = async () => {
    setDeployError(null)
    setIsDeploying(true)

    try {
      const txPromise = await wallet.smartWalletFactory.deploy()
      setSmartWalletDeployTx(txPromise)

      await txPromise.wait()
      await wallet.smartWalletFactory.isDeployed().then(setIsDeployed)
      setIsDeploying(false)
    } catch (error: any) {
      setDeployError(error.toString())
      setIsDeploying(false)
    }
  }

  const hasBalance = eoaBalance.toString() !== '0'

  return (
    <ScrollView style={styles.background}>
      <Text style={styles.heading}>Deploy Smart Wallet</Text>
      <Text style={styles.text}>
        This is a temporary step that is needed before RIF Relay Server is
        ready.
      </Text>

      {isDeployed && (
        <Text style={styles.text}>Your smart wallet has been deployed!</Text>
      )}

      {!isDeployed && (
        <View>
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
                  onPress={() => Clipboard.setString(wallet.address)}>
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
                style={styles.button}>
                <Text>Open the RBTC Faucet in your browser</Text>
              </SecondaryButton>
            )}
          </View>

          <Text style={styles.heading}>Step 2: Deploy the wallet</Text>
          <SecondaryButton
            disabled={!hasBalance}
            onPress={deploy || isDeploying}
            style={!hasBalance ? styles.buttonDisabled : styles.button}>
            <Text>Deploy Wallet</Text>
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
    width: '100%',
    marginVertical: 10,
  },
  buttonDisabled: {
    backgroundColor: colors.darkPurple4,
  },
})
