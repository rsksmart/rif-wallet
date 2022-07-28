/* eslint-disable prettier/prettier */
import SDK, { RelayCalls, SDKConfiguration } from '@jessgusclark/rsk-multi-token-sdk'
import { ethers, Signer } from 'ethers'
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PrimaryButton from '../../components/button/PrimaryButton'

import { getWalletSetting, SETTINGS } from '../../core/config'
import { ScreenWithWallet } from '../types'

type Interface = {}

const RelayDeployScreen: React.FC<Interface & ScreenWithWallet> = ({ wallet,
}) => {
  const doIt = async () => {
    console.log('doing it... 4', wallet)

    const jsonProvider = new ethers.providers.JsonRpcProvider(getWalletSetting(SETTINGS.RPC_URL))

    const sdkConfig: SDKConfiguration = {
      chainId: 31,
      relayWorkerAddress: '0x39b12c05e8503356e3a7df0b7b33efa4c054c409'.toLowerCase(),
      relayVerifierAddress: '0x5159345aaB821172e795d56274D0f5FDFdC6aBD9'.toLowerCase(),
      deployVerifierAddress: '0x1eD614cd3443EFd9c70F04b6d777aed947A4b0c4'.toLowerCase(),
      smartWalletContractAddress: '0x73ec81da0C72DD112e06c09A6ec03B5544d26F05'.toLowerCase(), // Not sure about this one!
      smartWalletFactoryContractAddress: '0x03F23ae1917722d5A27a2Ea0Bcc98725a2a2a49a'.toLowerCase(),
      /// @ts-ignore: missing _difficulty
      signer: wallet.smartWallet.signer,
    }

    // @ts-ignore
    const sdk = await SDK.create(jsonProvider, sdkConfig)

    console.log(sdk)
    const relayHubAddress = '0xE0825f57Dd05Ef62FF731c27222A86E104CC4Cad'.toLowerCase()

    const relayUtils = await RelayCalls.getInstance(
            // @ts-ignore provider is correct
      jsonProvider,
      31,
      relayHubAddress,
      sdk.instance.modules.smartWalletFactory,
      sdkConfig.relayWorkerAddress,
      sdkConfig.deployVerifierAddress,
      sdkConfig.relayVerifierAddress,
      /// @ts-ignore: missing _difficulty
      wallet // wallet.smartWallet.signer
    )

    console.log({relayUtils})

    const request = await relayUtils.createDeployRequest(
      '0xFcC32347a7522fe6C782703d6aDd8073162b7342'.toLowerCase(), // EOA address,
      '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe', // RIF,
      '2',
      '30000'
    )

    console.log(request)

    /*
    const relayUtils = await RelayCalls.getInstance(
      jsonProvider,
      31,
      contracts.relayHubAddress,
      smartWalletFactory,
      contracts.relayHubAddress,
      contracts.deployVerifierAddress,
      contracts.relayVerifierAddress,
      wallet
    )

    
    RelayCalls.getInstance(
    // const relayCalls = new RelayCalls(
      jsonProvider,
      31,
      contracts.relayHubAddress,
      SmartWalletFactory,  // factory: SmartWalletFactory,
      contracts.relayWorkerAddress,
      contracts.deployVerifierAddress,
      contracts.relayVerifierAddress,
      wallet, // signer
    ).then((relayCalls: RelayCalls) => {
      console.log({ relayCalls })

      // @ts-ignore
      relayCalls.createDeployRequest()
        .then((deployRequest: any) => {
          console.log(deployRequest)
        })
        .catch(console.log)
    })
    */
  }

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
