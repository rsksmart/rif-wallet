import BIP84Payment from './BIP84Payment'
import { IPayment } from './types'

function getPaymentInstance(
  paymentType: string = 'p2wpkh',
  ...args: any
): IPayment {
  switch (paymentType) {
    case 'p2wpkh':
    default:
      // @ts-ignore
      return new BIP84Payment(...args)
  }
}

export default getPaymentInstance
