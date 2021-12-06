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

export const WalletInfoScreen: React.FC<ScreenWithWallet> = ({
  wallet,
  isWalletDeployed,
}) => {
  const [eoaBalance, setEoaBalance] = useState<null | BigNumber>(null)
  const [isDeploying, setIsDeploying] = useState(false)

  const [smartWalletDeployTx, setSmartWalletDeployTx] =
    useState<null | Transaction>(null)

  const [rifBalance, setRifBalance] = useState<null | BigNumber>(null)
  const [sendRifTx, setSendRifTx] = useState<null | Transaction>(null)
  const [sendRifResponse, setSendRifResponse] = useState<null | string>(null)
  const { t } = useTranslation()

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
      const txPromise = await wallet.smartWalletFactory.deploy()
      setSmartWalletDeployTx(txPromise)

      await txPromise.wait()

      DevSettings.reload('Smart wallet deployed')
    } catch (error) {
      setIsDeploying(false)
    }
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
