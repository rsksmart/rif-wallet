import React, { useState } from 'react'
import { ScrollView } from 'react-native-gesture-handler'
import { Transaction, BigNumber } from 'ethers'
import { Trans, useTranslation } from 'react-i18next'
import { ERC20Token } from '../../lib/token/ERC20Token'

import {
  Address,
  Button,
  CopyComponent,
  Header2,
  Paragraph,
} from '../../components'
import { ScreenWithWallet } from '../types'
import { DevSettings } from 'react-native'
import { SmartWallet } from '@rsksmart/relaying-services-sdk'
import { useRifRelayProviderState } from '../../subscriptions/RifRelayProvider'
import { rifRelayService } from '../../core/setup'

export const WalletInfoScreen: React.FC<ScreenWithWallet> = ({
  wallet,
  isWalletDeployed,
}) => {
  type DeployInfo = {
    fees: number | string
    check: boolean
    tokenGas: number | string
    relayGas: number
  }

  type DeployInfoKey = keyof DeployInfo

  const [eoaBalance, setEoaBalance] = useState<null | BigNumber>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const [rifBalance, setRifBalance] = useState<null | BigNumber>(null)
  const [sendRifTx, setSendRifTx] = useState<null | Transaction>(null)
  const [sendRifResponse, setSendRifResponse] = useState<null | string>(null)
  const [transfer, setTransfer] = useState({
    check: false,
    fees: 0,
    amount: 1,
    address: '0xa975D1DE6d7dA3140E9e293509337373402558bE',
  })
  const { t } = useTranslation()
  const [deployRif, setDeployRif] = useState<DeployInfo>({
    fees: 0,
    check: false,
    tokenGas: 0,
    relayGas: 0,
  })

  const { rifRelayProvider } = useRifRelayProviderState()

  const currentSmartWallet = {
    index: 0,
    deployed: isWalletDeployed,
    address: wallet.smartWallet.smartWalletAddress,
  }

  const rif = new ERC20Token(
    '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe',
    wallet,
    'RIF',
    'null.jpg',
  )

  const getInfo = async () => {
    Promise.all([
      wallet.smartWallet.signer.getBalance().then(setEoaBalance),
      rif.balance().then(setRifBalance),
    ]).catch((err: Error) => {
      console.log(err)
    })
  }

  const deploy = async () => {
    try {
      setIsDeploying(true)
      const txPromise = await wallet.smartWalletFactory.deploy(wallet.address)
      setSmartWalletDeployTx(txPromise)

      await txPromise.wait()

      DevSettings.reload('Smart wallet deployed')
    } catch (error) {
      setIsDeploying(false)
    }
  }

  const deployRifRelay = async () => {
    try {
      setIsDeploying(true)
      await estimateFeesToDeploySmartWallet(currentSmartWallet)
      console.log(deployRif.fees)
      await deploySmartWalletRifRelay()
      DevSettings.reload('Smart wallet deployed')
    } catch (error) {
      setIsDeploying(false)
    }
  }

  const transferTestToken = async () => {
    await rifRelayService.transferToken(
      rifRelayProvider!,
      transfer.address,
      transfer.amount,
      transfer.fees,
      isWalletDeployed,
    )
  }

  async function deploySmartWalletRifRelay() {
    const smartWallet = await rifRelayService.deploySmartWallet(
      rifRelayProvider!,
      deployRif.fees,
      currentSmartWallet,
    )
    console.log(smartWallet)
  }

  async function estimateFeesToDeploySmartWallet(newSmartWallet: SmartWallet) {
    const fees = await rifRelayService.estimateFeesToDeploySmartWallet(
      rifRelayProvider!,
      newSmartWallet,
    )
    changeValue(fees, 'fees')
  }

  async function handleEstimateFeesToDeploySmartWallet() {
    const newSmartWallet = await rifRelayProvider?.generateSmartWallet(2)
    await estimateFeesToDeploySmartWallet(newSmartWallet!)
    console.log(deployRif.fees)
  }

  async function handleEstimateFeesToTransferSmartWallet() {
    const fee = await rifRelayService.estimateFeesToTransfer(
      rifRelayProvider!,
      transfer.address,
      transfer.amount,
    )
    changeTransferValue(fee, 'fees')
  }

  function changeValue<T>(value: T, prop: DeployInfoKey) {
    const obj: DeployInfo = { ...deployRif }
    // @ts-ignore: TODO: change this to be type safe
    obj[prop] = value
    setDeployRif(obj)
  }

  function changeTransferValue<T>(value: T, prop: DeployInfoKey) {
    const obj: any = { ...transfer }
    // @ts-ignore: TODO: change this to be type safe
    obj[prop] = value
    setTransfer(obj)
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
      <Address>{wallet.address}</Address>
      <Paragraph>Smart Wallet Address:</Paragraph>
      <Address>{wallet.smartWalletAddress}</Address>

      <Button title={t('Get info')} onPress={getInfo} />
      <Paragraph>
        <Trans>RBTC Balance (EOA)</Trans>: {eoaBalance && eoaBalance.toString()}
      </Paragraph>

      <Paragraph>
        <Trans>Is Deployed?</Trans>: {isWalletDeployed.toString()}
      </Paragraph>
      {isDeploying && (
        <Paragraph>
          <Trans>Deploying</Trans>
        </Paragraph>
      )}
      {!isWalletDeployed && (
        <Button
          title={t('Deploy')}
          onPress={deploy}
          disabled={isWalletDeployed || isDeploying}
        />
      )}
      {!isWalletDeployed && (
        <Button
          title={t('Deploy Rif')}
          onPress={deployRifRelay}
          disabled={isWalletDeployed || isDeploying}
        />
      )}
      <Button
        title={t('Estimate Deploy Rif')}
        onPress={handleEstimateFeesToDeploySmartWallet}
      />
      <Paragraph>
        <Trans>Fees to deploy smart wallet</Trans>:{' '}
        {deployRif.fees && deployRif.fees.toString()}
      </Paragraph>
      <Button
        title={t('Estimate Transfer Using Rif')}
        onPress={handleEstimateFeesToTransferSmartWallet}
      />
      <Paragraph>
        <Trans>Fees to transfer smart wallet</Trans>:{' '}
        {transfer.fees && transfer.fees.toString()}
      </Paragraph>
      <Button title={t('Transfer')} onPress={transferTestToken} />
      <Paragraph>
        <Trans>RIF Token balance</Trans>: {rifBalance && rifBalance.toString()}
      </Paragraph>
      {smartWalletDeployTx && (
        <>
          <Paragraph>Deploy tx: {smartWalletDeployTx.hash}</Paragraph>
        </>
      )}
      {isWalletDeployed && (
        <>
          <Button title={t('Send RIF back to faucet')} onPress={sendRif} />
          {sendRifResponse && <Paragraph>{sendRifResponse}</Paragraph>}
          {sendRifTx && (
            <>
              <Paragraph>
                <Trans>Send RIF hash</Trans>:
              </Paragraph>
              <CopyComponent value={sendRifTx.hash || ''} />
            </>
          )}
        </>
      )}
    </ScrollView>
  )
}
