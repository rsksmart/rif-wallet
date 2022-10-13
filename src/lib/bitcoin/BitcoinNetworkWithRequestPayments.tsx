import BitcoinNetwork from './BitcoinNetwork'
import createBipFactory, { createBipFactoryType } from './BIPFactory'
import { OnRequest } from '../core'
import getPaymentInstance from './getPaymentInstance'
import { PaymentFactoryType } from './types'
import BIPPaymentFacade from './BIPPaymentFacade'
import BIPRequestPaymentFacade from './BIPRequestPaymentFacade'

type BitcoinNetworkWithRequestPaymentsType = ConstructorParameters<
  typeof BitcoinNetwork
>

const createBitcoinNetworkWithRequest = (
  request: OnRequest,
  ...args: BitcoinNetworkWithRequestPaymentsType
) => {
  const overrideBipFactory = (...argsBip: createBipFactoryType) => {
    return createBipFactory(argsBip[0], argsBip[1], argsBip[2], {
      paymentFactory: (...argsPayment: Parameters<PaymentFactoryType>) => {
        const paymentInstance = getPaymentInstance(...argsPayment)
        const paymentFacade = new BIPPaymentFacade(paymentInstance)
        return new BIPRequestPaymentFacade(request, paymentFacade)
      },
    })
  }
  return new BitcoinNetwork(args[0], args[1], args[2], overrideBipFactory)
}

export default createBitcoinNetworkWithRequest
