import Clipboard from '@react-native-community/clipboard'
import { BigNumber, Transaction } from 'ethers'
import { useCallback, useEffect, useState } from 'react'
import {
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'
import { RIFWallet } from '@rsksmart/rif-wallet-core'

import { PrimaryButton } from 'components/button/PrimaryButton'
import { SecondaryButton } from 'components/button/SecondaryButton'
import { CopyIcon } from 'components/icons'
import { MediumText, SemiBoldText } from 'src/components'
import { setWalletIsDeployed } from 'store/slices/settingsSlice'
import { useAppDispatch } from 'store/storeUtils'
import { colors, grid } from '../../styles'
import { ScreenWithWallet } from '../types'

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
    (_wallet: RIFWallet) =>
      _wallet.smartWallet.signer.getBalance().then(setEoaBalance),
    [],
  )

  useEffect(() => {
    if (wallet) {
      getInfo(wallet)
    }
  }, [getInfo, wallet])

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
      setDeployError(error.toString())
      setIsDeploying(false)
    }
  }

  const hasBalance = eoaBalance.toString() !== '0'

  return (
    <ScrollView style={styles.background}>
      <SemiBoldText style={styles.heading}>Deploy Smart Wallet</SemiBoldText>

      {isDeployed && (
        <MediumText style={styles.text}>
          Your smart wallet has been deployed!
        </MediumText>
      )}

      {!isDeployed && (
        <View>
          <MediumText style={styles.text}>
            This is a temporary step that is needed before RIF Relay Server is
            ready.
          </MediumText>
          <MediumText style={styles.heading}>
            Step 1: Fund your EOA account
          </MediumText>
          <View>
            <MediumText style={styles.text}>
              Fund your Externally Owned Account (EOA) with rBTC. Copy your
              address below and paste it in the rBTC Faucet.
            </MediumText>

            <View style={grid.row}>
              <View style={grid.column3}>
                <MediumText style={styles.text}>Address:</MediumText>
              </View>

              <View style={grid.column8}>
                <MediumText style={styles.text}>{wallet.address}</MediumText>
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
                <MediumText style={styles.text}>Balance:</MediumText>
              </View>
              <View style={grid.column8}>
                <MediumText style={styles.text}>
                  {eoaBalance ? eoaBalance.toString() : '0'}
                </MediumText>
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

          <MediumText style={styles.heading}>
            Step 2: Deploy the wallet
          </MediumText>
          <PrimaryButton
            disabled={!hasBalance}
            onPress={deploy || isDeploying}
            style={!hasBalance ? styles.buttonDisabled : styles.button}
            title="Deploy Wallet"
            accessibilityLabel="deploy"
          />

          {isDeploying && (
            <MediumText style={styles.text}>Deploying...</MediumText>
          )}

          {smartWalletDeployTx && (
            <TouchableOpacity
              onPress={() =>
                Clipboard.setString(smartWalletDeployTx.hash || '')
              }
              accessibilityLabel="explorer">
              <MediumText style={styles.text}>
                {smartWalletDeployTx.hash || ''}
                <CopyIcon />
              </MediumText>
            </TouchableOpacity>
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
