import BIP84Payment from './BIP84Payment'
import { IPayment } from './types'

function getPaymentInstance(paymentType = 'p2wpkh', ...args: any): IPayment {
  switch (paymentType) {
    case 'p2wpkh':
    default:
      return new BIP84Payment(...args)
  }
}

export default getPaymentInstance
