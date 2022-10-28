import { OnRequest } from '../core'
import BIPPaymentFacade from './BIPPaymentFacade'
import {
  PaymentType,
  Psbt,
  SendBitcoinRequestType,
  UnspentTransactionType,
} from './types'
import { BITCOIN_REQUEST_TYPES } from './constants'
import { ISendTransactionJsonReturnData } from '../rifWalletServices/RifWalletServicesFetcher'

export default class BIPRequestPaymentFacade {
  request: OnRequest
  payment: BIPPaymentFacade
  generatedPayment!: Psbt
  miningFee!: number
  amountToPay!: number
  addressToPay!: string
  utxos!: UnspentTransactionType[]
  resolve!: (value: ISendTransactionJsonReturnData) => void
  constructor(request: OnRequest, payment: BIPPaymentFacade) {
    this.request = request
    this.payment = payment
  }
  setArguments({
    amountToPay,
    addressToPay,
    unspentTransactions,
    miningFee,
  }: PaymentType) {
    this.amountToPay = amountToPay
    this.addressToPay = addressToPay
    this.utxos = unspentTransactions
    this.miningFee = miningFee
  }

  getPaymentArguments(): PaymentType {
    return {
      amountToPay: this.amountToPay,
      addressToPay: this.addressToPay,
      unspentTransactions: this.utxos,
      miningFee: this.miningFee,
    }
  }
  /*
    Sets the generatedPayment property with the current arguments
  * */
  async setGeneratedPayment() {
    this.generatedPayment = await this.payment.generatePayment(
      this.getPaymentArguments(),
    )
    return this.generatedPayment
  }
  /**
   * Build request
   */
  async onRequestPayment({
    ...args
  }: PaymentType & {
    balance: number
  }): Promise<ISendTransactionJsonReturnData> {
    this.setArguments({ ...args })
    await this.setGeneratedPayment()
    return new Promise((res, rej) => {
      this.resolve = res
      this.request({
        type: BITCOIN_REQUEST_TYPES.SEND_BITCOIN,
        payload: {
          ...args,
          payment: this as BIPRequestPaymentFacade,
        },
        confirm: () => this.onRequestPaymentConfirmed(res),
        reject: rej,
      } as SendBitcoinRequestType)
    })
  }

  /**
   * When payment is confirmed then proceed with:
   * 1- recreating payment with the previous arguments and new mining fee;
   * 2- signing
   * 3- sending
   */
  async onRequestPaymentConfirmed(
    resolve: (value: ISendTransactionJsonReturnData) => void,
  ) {
    await this.setGeneratedPayment()
    const tx = await this.payment.signAndSend(this.generatedPayment)
    if (tx.error) {
      throw new Error(tx.error)
    } else {
      resolve(tx)
    }
  }

  setMiningFee(miningFee: number) {
    this.miningFee = miningFee
    return miningFee
  }
}
