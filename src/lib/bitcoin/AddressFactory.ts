import { payments } from 'bitcoinjs-lib'

export default class AddressFactory {
  purpose: string | number
  network: any
  constructor(purpose = 84, network: any) {
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
