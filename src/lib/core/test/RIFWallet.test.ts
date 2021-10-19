import { deploySmartWalletFactory, sendAndWait, createNewTestWallet, testJsonRpcProvider } from './utils'
import { SmartWalletFactory } from '../src/SmartWalletFactory'
import { RIFWallet } from '../src/RIFWallet'
import { BigNumber } from '@ethersproject/bignumber'
import { TransactionRequest } from '@ethersproject/abstract-provider'

const txRequest = {
  to: '0x0000000000111111111122222222223333333333',
  data: '0xabcd'
}

describe('RIFWallet', function (this: {
  rifWallet: RIFWallet
  onRequest: ReturnType<typeof jest.fn>
}) {
  beforeEach(async () => {
    const wallet = await createNewTestWallet()

    const smartWalletFactoryContract = await deploySmartWalletFactory()

    const smartWalletFactory = await SmartWalletFactory.create(wallet, smartWalletFactoryContract.address)
    await sendAndWait(smartWalletFactory.deploy())

    const smartWalletAddress = await smartWalletFactory.getSmartWalletAddress()

    this.onRequest = jest.fn()
    this.rifWallet = await RIFWallet.create(wallet, smartWalletAddress, this.onRequest)
  })

  test('uses smart address', async () => {
    expect(this.rifWallet.address).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
    expect(await this.rifWallet.getAddress()).toEqual(this.rifWallet.smartWallet.smartWalletAddress)
  })

  describe('send transaction', () => {
    test('uses direct send', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)
      this.rifWallet.nextRequest().confirm()
      const tx = await txPromise
      await tx.wait()

      expect(tx.to).toEqual(this.rifWallet.smartWalletAddress)
      expect(tx.data).toContain('0000000000111111111122222222223333333333')
      expect(tx.data).toContain('abcd')
    })

    test('allows to override params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const overriddenTxRequest: TransactionRequest = {
        ...txRequest,
        gasPrice,
        gasLimit
      }

      const txPromise = this.rifWallet.sendTransaction(overriddenTxRequest)
      this.rifWallet.nextRequest().confirm()
      const tx = await txPromise
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })
  })

  describe('queue', () => {
    test('is initially mepty', () => {
      expect(() => this.rifWallet.nextRequest()).toThrow()
    })

    test('queues a transaction', async () => {
      this.rifWallet.sendTransaction(txRequest)

      expect(this.rifWallet.nextRequest().type).toEqual('sendTransaction')
    })

    test('cannot send a transaction when another is pending (for now, this should be a queue)', async () => {
      this.rifWallet.sendTransaction(txRequest)

      expect(this.rifWallet.sendTransaction(txRequest)).rejects.toThrow()
    })

    test('can reject a tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().reject()

      await expect(txPromise).rejects.toThrow()
    })

    test('can confirm a tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx = await txPromise
      await tx.wait()

      // first is the deploy, second this tx
      expect(await testJsonRpcProvider.getTransactionCount(this.rifWallet.smartWallet.wallet.address)).toEqual(2)
    })

    test('can do more than one tx', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx = await txPromise
      await tx.wait()

      const txPromise2 = this.rifWallet.sendTransaction(txRequest)

      this.rifWallet.nextRequest().confirm()

      const tx2 = await txPromise2
      await tx2.wait()

      // first is the deploy, second this tx
      expect(await testJsonRpcProvider.getTransactionCount(this.rifWallet.smartWallet.wallet.address)).toEqual(3)
    })

    test('can modify tx params', async () => {
      const gasPrice = BigNumber.from('100')
      const gasLimit = BigNumber.from('600000')

      const txPromise = this.rifWallet.sendTransaction(txRequest)

      const nextRequest = this.rifWallet.nextRequest()
      nextRequest.payload.transactionRequest.gasPrice = gasPrice
      nextRequest.payload.transactionRequest.gasLimit = gasLimit
      nextRequest.confirm()

      const tx = await txPromise
      await tx.wait()

      expect(tx.gasPrice).toEqual(gasPrice)
      expect(tx.gasLimit).toEqual(gasLimit)
    })

    test('cannot edit the next request, only the params of the payload', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      const nextRequest = this.rifWallet.nextRequest()
      expect(() => { nextRequest.confirm = (v) => {} }).toThrow()
      expect(() => { nextRequest.reject = (v) => {} }).toThrow()
      expect(() => { nextRequest.type = 'sendTransaction' }).toThrow()
      expect(() => { nextRequest.payload = {} as any }).toThrow()

      this.rifWallet.nextRequest().reject() // close handle
      await expect(txPromise).rejects.toThrow()
    })
  })

  describe('onRequest', () => {
    test('is called with a new sendTransaction', async () => {
      const txPromise = this.rifWallet.sendTransaction(txRequest)

      expect(this.onRequest).toHaveBeenCalledWith(this.rifWallet.nextRequest())

      this.rifWallet.nextRequest().reject() // close handle
      await expect(txPromise).rejects.toThrow()
    })
  })
})
