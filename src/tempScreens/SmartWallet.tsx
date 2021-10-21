import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction } from 'ethers'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { RIFWallet } from '../lib/core/RIFWallet'

import { BigNumber } from 'ethers'
import CopyComponent from '../components/copy'
import { ERC20Token } from '../lib/token/ERC20Token'

const SmartWalletComponent = ({ route }: { route: any }) => {
  const [eoaBalance, setEoaBalance] = useState<null | BigNumber>(null)
  const [isSmartWalletDeployed, setIsSmartWalletDeployed] =
    useState<boolean>(false)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const [rifBalance, setRifBalance] = useState<null | BigNumber>(null)
  const [sendRifTx, setSendRifTx] = useState<null | Transaction>(null)
  const [sendRifResponse, setSendRifResponse] = useState<null | string>(null)

  const account = route.params.account as RIFWallet

  const rif = new ERC20Token(
    '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    account,
    'RIF',
    'null.jpg',
  )

  const getInfo = async () => {
    Promise.all([
      account.smartWallet.wallet.getBalance().then(setEoaBalance),
      account.smartWalletFactory.isDeployed().then(setIsSmartWalletDeployed),
      rif.balance().then(setRifBalance),
    ]).catch((err: Error) => {
      console.log(err)
    })
  }

  const deploy = async () => {
    const txPromise = await account.smartWalletFactory.deploy()
    setSmartWalletDeployTx(await txPromise)
    setIsSmartWalletDeployed(true)
  }

  const sendRif = async () => {
    setSendRifResponse(null)
    rif
      .transfer(
        '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
        BigNumber.from('10000000000000000000'),
      )
      .then((tx: Transaction) => {
        setSendRifTx(tx)
        setSendRifResponse('Transaction sent.')
      })
      .catch((err: Error) =>
        setSendRifResponse(`Transaction Err: ${err.message}`),
      )
  }

  return (
    <ScrollView>
      <Header2>Smart Wallet</Header2>
      <Paragraph>EOA:</Paragraph>
      <CopyComponent value={account.smartWallet.wallet.address} />
      <Paragraph>Smart Wallet Address:</Paragraph>
      <CopyComponent value={account.address} />

      <Button title="Get info" onPress={getInfo} />
      <Paragraph>
        RBTC Balance (EOA): {eoaBalance && eoaBalance.toString()}
      </Paragraph>

      <Paragraph>Is Deployed?: {isSmartWalletDeployed.toString()}</Paragraph>
      {!isSmartWalletDeployed && (
        <Button
          title="Deploy"
          onPress={deploy}
          disabled={isSmartWalletDeployed}
        />
      )}
      <Paragraph>
        RIF Token balance: {rifBalance && rifBalance.toString()}
      </Paragraph>
      {smartWalletDeployTx && (
        <>
          <Paragraph>Deploy tx: {smartWalletDeployTx.hash}</Paragraph>
        </>
      )}
      {isSmartWalletDeployed && (
        <>
          <Button title="Send RIF back to faucet" onPress={sendRif} />
          {sendRifResponse && <Paragraph>{sendRifResponse}</Paragraph>}
          {sendRifTx && (
            <>
              <Paragraph>Send RIF hash:</Paragraph>
              <CopyComponent value={sendRifTx.hash || ''} />
            </>
          )}
        </>
      )}
    </ScrollView>
  )
}

export default SmartWalletComponent
