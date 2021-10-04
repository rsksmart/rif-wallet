import { rskTestnetAddressFromPrivateKey } from '@rsksmart/rif-id-ethr-did'
import { BIP32Interface } from '@rsksmart/rif-id-mnemonic'
import { BigNumber } from 'ethers'
import { jsonRpcProvider } from '../jsonRpcProvider'

class Account {
  chainId: number

  path: string
  address: string
  balance: number

  // takes a dev path and a network (testnet/mainnet)
  constructor(network: 'RSK_TESTNET', path: string, bip32: BIP32Interface) {
    this.chainId = network === 'RSK_TESTNET' ? 31 : 0
    this.path = path

    this.address = rskTestnetAddressFromPrivateKey(
      // @ts-ignore
      bip32.privateKey.toString('hex'),
    )
    this.balance = 0
  }

  getBalance() {
    jsonRpcProvider.getBalance(this.address).then((balance: BigNumber) => {
      // BigNumber does not handle decimals, this is a poor workaround
      this.balance = parseInt(balance.toString(), 10) / Math.pow(10, 18)
      console.log('balance: ', this.balance)
    })
  }
}

export default Account
