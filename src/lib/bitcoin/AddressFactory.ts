import { Network, payments } from 'bitcoinjs-lib'

export default class AddressFactory {
  purpose: string | number
  network: Network

  constructor(purpose = 84, network: Network) {
    this.purpose = purpose
    this.network = network
  }
  getAddress(publicKey: Buffer): string {
    switch (this.purpose) {
      case 84:
        return payments.p2wpkh({
          network: this.network,
          pubkey: publicKey,
        }).address as string
      default:
        return ''
    }
  }
}
