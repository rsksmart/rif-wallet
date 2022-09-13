import BIP39 from './BIP39'
import { NETWORK_DATA } from './constants'
import BIP from './BIP'

export default class BitcoinNetwork {
  networkId: string
  networkName!: string
  coinTypeNumber!: number
  bipNames: any = {}
  BIP39Instance: BIP39
  bips: Array<BIP> = []
  balance = 0
  contractAddress: string
  symbol!: string
  constructor(
    networkId: string,
    bipNames: Array<string> = [],
    BIP39Instance: BIP39,
  ) {
    this.networkId = networkId
    this.contractAddress = networkId
    this.BIP39Instance = BIP39Instance
    this.setCoinConfiguration()
    if (bipNames.length === 0) {
      throw new Error('You must define a BIP for this Network')
    }
    this.setBips(bipNames)
    this.updateBalance()
  }
  setCoinConfiguration() {
    this.coinTypeNumber = NETWORK_DATA[this.networkId].coinTypeNumber
    this.networkName = NETWORK_DATA[this.networkId].networkName
    this.symbol = NETWORK_DATA[this.networkId].symbol
  }
  setBips(bips: Array<string>) {
    let counter = 0
    for (const bipName of bips) {
      const BIPInstance = new BIP(this, bipName, this.BIP39Instance.seed)
      this.bipNames[counter] = BIPInstance
      this.bipNames[bipName] = BIPInstance
      this.bips.push(BIPInstance)
      counter++
    }
  }
  async updateBalance() {
    console.log('bal')
    const balances = this.bips.map(bip => bip.fetchBalance())
    const balancesCompleted = await Promise.all(balances)
    this.balance = balancesCompleted.reduce((prev, curr) => {
      return prev + curr
    }, 0)
    return this.balance
  }
}
