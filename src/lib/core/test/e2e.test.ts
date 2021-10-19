import { deploySmartWalletFactory, sendAndWait, fundAccount, testJsonRpcProvider } from './utils'
import { KeyManagementSystem } from '../src/KeyManagementSystem'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { Request, RIFWallet } from '../src/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'

describe('e2e', () => {
  test('local account', async () => {
    // deployment of smart contracts
    const smartWalletFactoryContract = await deploySmartWalletFactory()

    // account creation
    const kms = KeyManagementSystem.create()
    const walletRequest = kms.nextWallet(31)

    // user confirmation
    walletRequest.save()

    // funding account
    const wallet = walletRequest.wallet.connect(testJsonRpcProvider)
    await sendAndWait(fundAccount(wallet.address))

    // smart wallet contract creation
    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
    await sendAndWait(smartWalletFactory.deploy())

    // rif wallet sdk

    // user that changes transaction params
    const gasPrice = BigNumber.from('100000')
    const onRequest = (nextRequest: Request) => {
      nextRequest.payload.transactionRequest.gasPrice = gasPrice
    }

    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()
    const rifWallet = RIFWallet.create(wallet, smartWalletAddress, onRequest)

    // send transaction
    const txRequest = {
      to: '0x0000000000111111111122222222223333333333',
      data: '0xabcd'
    }

    const txPromise = rifWallet.sendTransaction(txRequest)

    // transaction is queued, waiting for confirmation
    const nextTx = rifWallet.nextRequest()

    expect(nextTx.type).toEqual('sendTransaction')

    // user confirms
    nextTx.confirm()

    // transaction is sent
    const tx = await txPromise

    // transaction is confirmed (mined)
    const receipt = await tx.wait()

    expect(tx.gasPrice).toEqual(gasPrice)
    expect(receipt.status).toBe(1)
  })
})
