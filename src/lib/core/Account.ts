import { rskTestnetAddressFromPrivateKey } from '@rsksmart/rif-id-ethr-did'
import { BigNumber } from 'ethers'
import { jsonRpcProvider } from '../jsonRpcProvider'

class Account {
  path: string
  address: string
  balance: number

  // takes a dev path and a network (testnet/mainnet)
  constructor(path: string, privateKey: string) {
    this.path = path
    this.address = rskTestnetAddressFromPrivateKey(privateKey)
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
