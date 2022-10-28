import BIP from './BIP'
import BIPRequestPaymentFacade from './BIPRequestPaymentFacade'
import { OnRequest } from '../core'
import BIPPaymentFacade from './BIPPaymentFacade'

class BIPWithRequest extends BIP {
  request!: OnRequest
  paymentFacade!: BIPPaymentFacade
  requestPayment!: BIPRequestPaymentFacade
  setRequest(request: OnRequest) {
    this.request = request
  }
  setPaymentFacade() {
    this.paymentFacade = new BIPPaymentFacade(this.payment)
  }
  initialize(request: OnRequest) {
    this.setPaymentFacade()
    this.setRequest(request)
    this.requestPayment = new BIPRequestPaymentFacade(
      this.request,
      this.paymentFacade,
    )
  }
}

export default BIPWithRequest
