import Wallet from '../Wallet'
import {
  mnemonic,
  private_key_testnet_0,
  private_key_testnet_1,
} from './test-case'

describe('RIFWallet', () => {
  describe('create a wallet', () => {
    test('wallets have a 24 word mneomnic', () => {
      const wallet = Wallet.create()
      expect(wallet.getMnemonic.split(' ')).toHaveLength(24)
    })

    test('creates different wallets', () => {
      const wallet = Wallet.create()
      const anotherWallet = Wallet.create()
      expect(wallet.getMnemonic).not.toEqual(anotherWallet.getMnemonic)
    })
  })

  describe('import wallet', () => {
    test('imports a wallet given a mnemonic', () => {
      const wallet = new Wallet({ mnemonic })
      expect(wallet.getMnemonic).toEqual(mnemonic)
    })
  })

  describe('derives accounts', () => {
    test('creates a private key for an account', async () => {
      const wallet = new Wallet({ mnemonic })
      const account = await wallet.getAccount(0)
      expect(account.privateKey).toEqual(private_key_testnet_0)
    })

    test('creates the tree of private keys', async () => {
      const wallet = new Wallet({ mnemonic })
      const account = await wallet.getAccount(1)
      expect(account.privateKey).toEqual(private_key_testnet_1)
    })
  })
})
