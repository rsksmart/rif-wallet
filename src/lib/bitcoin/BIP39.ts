import { mnemonicToSeedSync } from '@rsksmart/rif-id-mnemonic'

export default class BIP39 {
  mnemonic: string
  seed: any
  constructor(mnemonic: string) {
    this.mnemonic = mnemonic
    this.setSeed()
  }
  setSeed() {
    this.seed = mnemonicToSeedSync(this.mnemonic)
  }
}
