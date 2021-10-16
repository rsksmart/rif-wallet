// import { TransactionRequest } from '@ethersproject/abstract-provider'
import Account from '../Account'
import {
  private_key_testnet_0,
  private_key_testnet_1,
  address_testnet_0,
  address_testnet_1,
  message,
  sig_testnet_0,
} from './test-case'

describe('Wallet', () => {
  describe('info', () => {
    test('has an address', async () => {
      const account = await Account.create({ privateKey: private_key_testnet_0 })
      expect(account.address.toLowerCase()).toEqual(address_testnet_0)
    })

    test('creates the correct address', async () => {
      const account = await Account.create({ privateKey: private_key_testnet_1 })
      expect(account.address.toLowerCase()).toEqual(address_testnet_1)
    })
  })

  describe('proxy methods', function (this: { account: Account }) {
    beforeEach(async () => {
      this.account = await Account.create({ privateKey: private_key_testnet_0 })
    })

    test('returns account', async () => {
      expect((await this.account.getAddress()).toLowerCase()).toEqual(address_testnet_0)
    })

    test('signs messages', async () => {
      expect(await this.account.signMessage(message)).toEqual(sig_testnet_0)
    })

    test('cannot change provider', () => {
      expect(() => this.account.connect({} as any)).toThrow()
    })
  })

  describe('transaction queue', function (this: { account: Account }) {
    beforeEach(async () => {
      this.account = await Account.create({ privateKey: private_key_testnet_0 })
    })

    test('cannot get next of emtpy queue', () => {
      expect(() => this.account.nextTransaction()).toThrow()
    })
    /*
    test('can queue a transaction', async () => {
      const transactionRequest: TransactionRequest = { to: address_testnet_1 }
      const transactionPromise =
        this.account.sendTransaction(transactionRequest)

      const nextTransaction = this.account.nextTransaction()
      expect(nextTransaction.transactionRequest).toEqual(transactionRequest)

      nextTransaction.confirm()

      const transaction = await transactionPromise
      expect(transaction).toBeDefined()
    })

    test('can queue many transaction', async () => {
      const transactionRequest1: TransactionRequest = {
        to: address_testnet_1,
        data: '0x1234',
      }
      const transactionRequest2: TransactionRequest = {
        to: address_testnet_1,
        data: '0x5678',
      }

      const transactionPromise1 =
        this.account.sendTransaction(transactionRequest1)
      const transactionPromise2 =
        this.account.sendTransaction(transactionRequest2)

      let nextTransaction = this.account.nextTransaction()
      expect(nextTransaction.transactionRequest).toEqual(transactionRequest1)

      nextTransaction.confirm()

      const transaction1 = await transactionPromise1
      expect(transaction1).toBeDefined()

      nextTransaction = this.account.nextTransaction()
      expect(nextTransaction.transactionRequest).toEqual(transactionRequest2)

      nextTransaction.confirm()

      const transaction2 = await transactionPromise2
      expect(transaction2).toBeDefined()
      expect(transaction1).not.toEqual(transaction2)
    })*/
  })
})
