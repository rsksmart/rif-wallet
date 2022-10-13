import { OnRequest } from '../core'
import BIPPaymentFacade from './BIPPaymentFacade'
import { PaymentType, Psbt, SendBitcoinRequestType } from './types'
import { BITCOIN_REQUEST_TYPES } from './constants'

export default class BIPRequestPaymentFacade {
  request: OnRequest
  payment: BIPPaymentFacade
  generatedPayment!: Psbt
  constructor(request: OnRequest, payment: BIPPaymentFacade) {
    this.request = request
    this.payment = payment
  }

  /**
   * Build request
   */
  async onRequestPayment({ ...args }: PaymentType) {
    this.generatedPayment = await this.payment.generatePayment(args)
    console.log(this.generatedPayment)
    return new Promise((res, rej) => {
      this.request({
        type: BITCOIN_REQUEST_TYPES.SEND_BITCOIN,
        payload: args,
        confirm: res,
        reject: rej,
      } as SendBitcoinRequestType)
    })
  }

  /**
   * When payment confirmed = proceed with sign and send
   */
  async onRequestPaymentConfirmed() {
    return this.payment.signAndSend(this.generatedPayment)
  }
}
