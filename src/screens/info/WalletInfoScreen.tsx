import React, { useCallback, useEffect, useState } from 'react'
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
import { ScreenWithWallet, SmartWalletWithBalance } from '../types'
import { DevSettings } from 'react-native'
import {
  DefaultRelayingServices,
  SmartWallet,
} from '@rsksmart/relaying-services-sdk'
import Utils, { TRIF_PRICE } from './Utils'
import { getWalletSetting, SETTINGS } from '../../core/config'
import { RifRelayProvider, useRifRelayProviderState } from '../../subscriptions/RifRelayProvider'

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
  const transfer = {
    check: false,
    fees: 0,
    amount: 1,
    address: '0xa975D1DE6d7dA3140E9e293509337373402558bE'
  };
  const { t } = useTranslation()
  const [deployRif, setDeployRif] = useState<DeployInfo>({
    fees: 0,
    check: false,
    tokenGas: 0,
    relayGas: 0,
  })
  const { rifRelayProvider } = useRifRelayProviderState()

  //const rifTokenAddress = '0x19f64674d8a5b4e652319f5e239efd3bc969a1fe'
  const testTokenAddress = '0xF5859303f76596dD558B438b18d0Ce0e1660F3ea'
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
      const txPromise = await wallet.smartWalletFactory.deploy()
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
      const smartWalletWithBalance = await setBalance(currentSmartWallet)
      await estimateFeesToDeploySmartWallet(smartWalletWithBalance)
      console.log(deployRif.fees)
      await deploySmartWalletRifRelay(smartWalletWithBalance)
      DevSettings.reload('Smart wallet deployed')
    } catch (error) {
      setIsDeploying(false)
    }
  }

  const transferTestToken = async () => {
    try {

      const amount = transfer.amount+"";
      const encodedAbi = (await Utils.getTokenContract()).methods
          .transfer(transfer.address, await Utils.toWei(amount)).encodeABI();

      const txDetials = await rifRelayProvider?.relayTransaction(
          {
              to: transfer.address
              , data: encodedAbi
          }
          , {
              tokenAddress: testTokenAddress
              , ...currentSmartWallet
          }
          , transfer.fees
      );
      console.log(txDetials);
    } catch (error) {
        console.error(error);
    }
  }

  async function deploySmartWalletRifRelay(
    currentSmartWallet: SmartWallet,
  ) {
    deployRif.fees = deployRif.fees === '' ? '0' : deployRif.fees
    deployRif.tokenGas = deployRif.tokenGas === '' ? '0' : deployRif.tokenGas

    const smartWallet = await relaySmartWalletDeployment(
      deployRif.fees,
      currentSmartWallet,
    )
    console.log(smartWallet)
  }

  async function relaySmartWalletDeployment(
    tokenAmount: string | number,
    currentSmartWallet: SmartWallet,
  ) {
    try {
      const isTokenAllowed = await rifRelayProvider?.isAllowedToken(
        testTokenAddress
      )
      if (isTokenAllowed) {
        const fees = await Utils.toWei(`${tokenAmount}`)
        const smartWallet = await rifRelayProvider?.deploySmartWallet(
          currentSmartWallet,
          testTokenAddress,
          fees as any,
        )
        const smartWalledIsDeployed = await checkSmartWalletDeployment(
          smartWallet?.deployTransaction!,
        )
        if (!smartWalledIsDeployed) {
          throw new Error('SmartWallet: deployment failed')
        }
        return smartWallet
      }
      throw new Error(
        'SmartWallet: was not created because Verifier does not accept the specified token for payment',
      )
    } catch (error) {
      const errorObj = error as Error
      if (errorObj.message) {
        console.log(errorObj.message)
      }
      console.error(error)
    }
    return undefined
  }

  async function checkSmartWalletDeployment(txHash: string) {
    const receipt = await getReceipt(txHash)

    if (receipt === null) {
      return false
    }

    console.log('Your receipt is')
    console.log(receipt)
    return receipt.status
  }

  async function getReceipt(transactionHash: string) {
    let receipt = await Utils.getTransactionReceipt(transactionHash)
    let times = 0

    while (receipt === null && times < 40) {
      times += 1
      // eslint-disable-next-line no-promise-executor-return
      const sleep = new Promise(resolve => setTimeout(resolve, 1000))
      // eslint-disable-next-line no-await-in-loop
      await sleep
      // eslint-disable-next-line no-await-in-loop
      receipt = await Utils.getTransactionReceipt(transactionHash)
    }

    return receipt
  }

  
  async function estimateFeesToDeploySmartWallet(
    currentSmartWallet: SmartWallet,
  ) {
    try {
      const estimate = await rifRelayProvider?.estimateMaxPossibleRelayGas(
        currentSmartWallet,
        '0xc6a4f4839b074b2a75ebf00a9b427ccb8073b7b4',
      )

      if (estimate) {
        const costInRBTC = await Utils.fromWei(estimate.toString())
        console.log('Cost in RBTC:', costInRBTC)

        const costInTrif = parseFloat(costInRBTC) / TRIF_PRICE
        const tokenContract = await Utils.getTokenContract()
        const ritTokenDecimals = await tokenContract.methods.decimals().call()
        const costInTrifFixed = costInTrif.toFixed(ritTokenDecimals)
        console.log('Cost in TRif: ', costInTrifFixed)

        if (deployRif.check === true) {
          changeValue(costInRBTC, 'fees')
        } else {
          changeValue(costInTrifFixed, 'fees')
        }
        console.log('Estimation Ended')
      }
    } catch (error) {
      const errorObj = error as Error
      if (errorObj.message) {
        console.log(errorObj.message)
      }
      console.error(error)
    }
  }


  function changeValue<T>(value: T, prop: DeployInfoKey) {
    const obj: DeployInfo = { ...deployRif }
    // @ts-ignore: TODO: change this to be type safe
    obj[prop] = value
    setDeployRif(obj)
  }

  

  const setBalance = useCallback(
    async (smartWallet: SmartWallet): Promise<SmartWalletWithBalance> => {
      const balance = await Utils.tokenBalance(smartWallet.address)
      const rbtcBalance = await Utils.getBalance(smartWallet.address)
      const swWithBalance = {
        ...smartWallet,
        balance: `${Utils.fromWei(balance)} tRIF`,
        rbtcBalance: `${Utils.fromWei(rbtcBalance)} RBTC`,
        deployed:
          (await rifRelayProvider?.isSmartWalletDeployed(smartWallet.address)) ||
          false,
      }
      return swWithBalance
    },
    [rifRelayProvider],
  )

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
          title={t('Transfer')}
          onPress={transferTestToken}
        />
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
