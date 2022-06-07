import Web3 from 'web3'
import { toHex } from 'web3-utils'
// TODO: we should avoid the direct dependency with rif-relay-client and rif-relay-common
import { RelayClient } from '@rsksmart/rif-relay-client'
import { EnvelopingTransactionDetails } from '@rsksmart/rif-relay-common'
import TestToken from './contracts/TestToken.json'

export const TRIF_PRICE = 0.000005739
export const TRIF_TOKEN_DECIMALS = 18
const web3 = new Web3(
  'http://relay-01.aws-us-west-2.dev.relay.rifcomputing.net:4444',
)
//const rifTokenAddress = '0x19F64674D8A5B4E652319F5e239eFd3bc969A1fE'
const testTokenAddress = '0xF5859303f76596dD558B438b18d0Ce0e1660F3ea'

class Utils {

  static async tokenBalance(address: string) {
    const rifTokenContract: any = new web3.eth.Contract(
      TestToken.abi as any,
      testTokenAddress,
    )
    rifTokenContract.setProvider(web3.currentProvider)
    const balance = await rifTokenContract.methods.balanceOf(address).call()
    return balance
  }

  static async getTokenContract() {
    const rifTokenContract: any = new web3.eth.Contract(
      TestToken.abi as any,
      testTokenAddress,
    )
    rifTokenContract.setProvider(web3.currentProvider)
    return rifTokenContract
  }

  static async getBalance(address: string) {
    const balance = await web3.eth.getBalance(address)
    return balance
  }

  static fromWei(balance: string) {
    return web3.utils.fromWei(balance)
  }

  static async toWei(tRifPriceInRBTC: string) {
    return web3.utils.toWei(tRifPriceInRBTC)
  }

  static async getTransactionReceipt(transactionHash: string) {
    return web3.eth.getTransactionReceipt(transactionHash)
  }
}

export default Utils
