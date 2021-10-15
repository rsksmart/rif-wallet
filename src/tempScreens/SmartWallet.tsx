import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction } from 'ethers'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { Account } from '../lib/core'
import { SmartWalletFactory } from '../lib/core/smartWallet/smart-wallet-factory'

import { Contract, BigNumber } from 'ethers'
import CopyComponent from '../components/copy'

const abi = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  'function transfer(address to, uint amount) returns (bool)',

  'event Transfer(address indexed from, address indexed to, uint amount)',
]

export const rifContract = new Contract(
  '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
  abi,
)

const SmartWalletComponent = ({ route }: { route: any }) => {
  const [eoaBalance, setEoaBalance] = useState<null | BigNumber>(null)
  const [smartWalletAddress, setSmartWalletAddress] = useState('')
  const [smartWalletCode, setSmartWalletCode] = useState('')

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const [rifBalance, setRifBalance] = useState<null | BigNumber>(null)
  const [sendRifTx, setSendRifTx] = useState<null | Transaction>(null)
  const [sendRifResponse, setSendRifResponse] = useState<null | string>(null)

  const account = route.params.account as Account
  console.log('eoa', account.address)

  const smartWalletFactory = new SmartWalletFactory(account)
  const rif = rifContract.connect(account)

  const getInfo = async () => {
    const address = await account.getSmartAddress()
    console.log('smart address', address)
    setSmartWalletAddress(address)

    Promise.all([
      account.getBalance().then(setEoaBalance),
      smartWalletFactory.getCodeInSmartWallet().then(setSmartWalletCode),
      rif.balanceOf(address).then(setRifBalance),
    ])
  }

  const deploy = async () => {
    const txPromise = await account.deploy()
    setSmartWalletDeployTx(await txPromise)
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
      .catch((err: Error) => {
        console.log('SmartWallet.tsx catach ?', err)
        setSendRifResponse(`Transaction Err: ${err.message}`)
      })
  }

  const isSmartWalletDeployed = !smartWalletCode || smartWalletCode !== '0x'

  return (
    <ScrollView>
      <Header2>Smart Wallet</Header2>
      <Paragraph>EOA:</Paragraph>
      <CopyComponent value={account.address} />
      <Button title="Get info" onPress={getInfo} />
      <Paragraph>
        RBTC Balance (EOA): {eoaBalance && eoaBalance.toString()}
      </Paragraph>
      <CopyComponent value={smartWalletAddress} />
      <Paragraph>Smart wallet code:</Paragraph>
      <CopyComponent value={smartWalletCode} />
      <Paragraph>
        RIF Token balance: {rifBalance && rifBalance.toString()}
      </Paragraph>
      <Button
        title="Deploy"
        onPress={deploy}
        disabled={isSmartWalletDeployed}
      />
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
            <Paragraph>
              Send RIF hash:
              <CopyComponent value={sendRifTx.hash || ''} />
            </Paragraph>
          )}
        </>
      )}
    </ScrollView>
  )
}

export default SmartWalletComponent
