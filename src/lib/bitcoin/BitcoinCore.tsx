const ENV_NETWORK = 'TESTNET' // @TODO: use ENV variable
const NETWORKS = {
  TESTNET: true,
  MAINNET: false,
}

class BitcoinCore {
  mnemonic: string
  root: any
  wallet: any
  account: any
  BIP84 = require('bip84')
  addressCursor = -1
  constructor(mnemonic: string) {
    this.mnemonic = mnemonic
    this.root = new this.BIP84.fromMnemonic(
      mnemonic,
      null,
      NETWORKS[ENV_NETWORK],
    )
    this.wallet = this.root.deriveAccount(0)
    this.account = new this.BIP84.fromZPrv(this.wallet)
  }

  getAccountAddress(index: number) {
    return this.account.getAddress(index)
  }
  getNextAddress() {
    this.addressCursor++
    return this.getAccountAddress(this.addressCursor)
  }
  getPreviousAddress() {
    this.addressCursor--
    if (this.addressCursor < 0) {
      this.addressCursor = 0
    }
    return this.getAccountAddress(this.addressCursor)
  }
  getPublicKey() {
    return this.account.getAccountPublicKey()
  }
}

export default BitcoinCore
