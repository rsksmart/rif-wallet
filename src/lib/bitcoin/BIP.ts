import PathDerivator from './PathDerivator'
const { fromSeed } = require('bip32')
import { COIN_BIPS, BIP_DATA } from './constants'
import BitcoinNetwork from './BitcoinNetwork'
import AddressFactory from './AddressFactory'
import { RifWalletServicesFetcher } from '../rifWalletServices/RifWalletServicesFetcher'
import { rifWalletServicesFetcher as defaultFetcherInstance } from '../../core/setup'

export default class BIP {
  network: BitcoinNetwork
  PathDerivator: PathDerivator
  bipId: string
  bipNumber: number
  bip32Root!: any
  account!: any
  accountPublicKey!: any
  accountPrivateKey!: any
  networkInfo!: any
  AddressFactory!: AddressFactory
  RifWalletServicesFetcherInstance: RifWalletServicesFetcher
  balance!: number
  btc!: number
  bipName: string

  constructor(
    networkInstance: BitcoinNetwork,
    bipId: string,
    seed: Buffer,
    rifWalletServicesFetcherInstance = defaultFetcherInstance,
  ) {
    this.RifWalletServicesFetcherInstance = rifWalletServicesFetcherInstance
    this.network = networkInstance
    this.bipId = bipId
    this.bipNumber = BIP_DATA[bipId].number
    this.bipName = BIP_DATA[bipId].name
    this.PathDerivator = new PathDerivator(
      this.bipNumber,
      this.network.coinTypeNumber,
      0,
    )
    this.setBIP32RootKey(seed)
    this.setAccount()
    this.setNetworkInfo()
    this.setAddressFactory()
  }

  setBIP32RootKey(seed: Buffer) {
    this.bip32Root = fromSeed(
      seed,
      COIN_BIPS[this.network.networkId][this.bipId],
    )
  }
  setAccount() {
    const accountDerivation = this.PathDerivator.getAccountDerivation()
    this.account = this.bip32Root.derivePath(accountDerivation)
    this.accountPrivateKey = this.account.toBase58()
    this.accountPublicKey = this.account.neutered().toBase58()
  }
  setNetworkInfo() {
    this.networkInfo = COIN_BIPS[this.network.networkId][this.bipId]
  }
  setAddressFactory() {
    this.AddressFactory = new AddressFactory(this.bipNumber, this.networkInfo)
  }
  getAddress(index = 0): string {
    const bip32Instance = this.bip32Root.derivePath(
      this.PathDerivator.getAddressDerivation(index),
    )
    return this.AddressFactory.getAddress(bip32Instance.publicKey)
  }
  async fetchBalance() {
    const data = await this.RifWalletServicesFetcherInstance.fetchXpubBalance(
      this.accountPublicKey,
    )
    this.balance = parseInt(data.balance, 10)
    this.btc = data.btc
    return this.btc
  }
  async fetchExternalAvailableAddress() {
    const index =
      await this.RifWalletServicesFetcherInstance.fetchXpubNextUnusedIndex(
        this.accountPublicKey,
      )
    return this.getAddress(index)
  }
}
