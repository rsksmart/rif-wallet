import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction } from 'ethers'
import Button from '../components/button'
import { Header2, Paragraph } from '../components/typography'
import { Account } from '../lib/core'
import { SmartWalletFactory } from '../lib/core/smartWallet/smart-wallet-factory'
import { SmartWallet } from '../lib/core/smartWallet/smart-wallet'

import { Contract, BigNumber } from 'ethers'

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
  const [smartWalletAddress, setSmartWalletAddress] = useState('')
  const [smartWalletCode, setSmartWalletCode] = useState('')

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const [rifBalance, setRifBalance] = useState<null | BigNumber>(null)
  const [sendRifTx, setSendRifTx] = useState<null | Transaction>(null)

  const account = route.params.account as Account
  console.log('eoa', account.address)

  const smartWalletFactory = new SmartWalletFactory(account)
  const rif = rifContract.connect(account)

  const getInfo = async () => {
    const address = await smartWalletFactory.getSmartAddress()
    console.log('smart address', address)
    setSmartWalletAddress(address)

    Promise.all([
      smartWalletFactory.getCodeInSmartWallet().then(setSmartWalletCode),
      rif.balanceOf(address).then(setRifBalance),
    ])
  }

  const deploy = async () => {
    const txPromise = smartWalletFactory.createSmartWallet()
    const nextTx = account.nextTransaction()
    console.log('nextTx', nextTx)
    nextTx.confirm()
    setSmartWalletDeployTx(await txPromise)
  }

  const sendRif = async () => {
    const data = rif.interface.encodeFunctionData('transfer', [
      '0x248b320687ebf655f9ee7f62f0388c79fbb7b2f4',
      BigNumber.from('10000000000000000000'),
    ])
    const smartWallet = new SmartWallet(smartWalletAddress, account)
    const txPromise = smartWallet.directExecute(rif.address, data)
    console.log(txPromise)
    const nextTx = account.nextTransaction()
    console.log('nextTx', nextTx)
    nextTx.confirm()
    console.log('confirmed')
    const tx = await txPromise
    setSendRifTx(tx)
    await tx.wait()
    await rif.balanceOf(smartWalletAddress).then(setRifBalance)
  }

  const isSmartWalletDeployed = !smartWalletCode || smartWalletCode !== '0x'

  return (
    <ScrollView>
      <Header2>Smart Wallet</Header2>
      <Paragraph>EOA: {account.address}</Paragraph>
      <Button title="Get info" onPress={getInfo} />
      <Paragraph>Smart wallet address: {smartWalletAddress}</Paragraph>
      <Paragraph>Smart wallet code: {smartWalletCode}</Paragraph>
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
          <Paragraph>Send RIF tx: {sendRifTx && sendRifTx.hash}</Paragraph>
        </>
      )}
    </ScrollView>
  )
}

export default SmartWalletComponent
