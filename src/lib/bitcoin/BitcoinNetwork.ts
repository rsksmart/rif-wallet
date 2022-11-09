import BIP39 from './BIP39'
import { NETWORK_DATA } from './constants'
import BIP from './BIP'
import createBipFactory from './BIPFactory'

export default class BitcoinNetwork {
  networkId: string
  networkName!: string
  coinTypeNumber!: number
  bipNames: { [key: string]: BIP } = {}
  BIP39Instance: BIP39
  BIPFactory: typeof createBipFactory
  bips: Array<BIP> = []
  balance = 0
  satoshis = 0
  contractAddress: string
  symbol!: string
  decimals = 8
  constructor(
    networkId: string,
    bipNames: Array<string> = [],
    BIP39Instance: BIP39,
    bipFactory = createBipFactory,
  ) {
    this.networkId = networkId
    this.contractAddress = networkId
    this.BIP39Instance = BIP39Instance
    this.BIPFactory = bipFactory
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
      const BIPInstance = this.BIPFactory(
        this,
        bipName,
        this.BIP39Instance.seed,
      )
      this.bipNames[counter] = BIPInstance
      this.bipNames[bipName] = BIPInstance
      this.bips.push(BIPInstance)
      counter++
    }
  }
  async updateBalance() {
    const balances = this.bips.map(bip => bip.fetchBalance())
    await Promise.all(balances)
    let satoshis = 0
    let balance = 0
    this.bips.map(bip => {
      satoshis += Number(bip.balance) || 0
      balance += bip.btc
    })
    this.satoshis = satoshis
    this.balance = balance
    return this.balance
  }
}