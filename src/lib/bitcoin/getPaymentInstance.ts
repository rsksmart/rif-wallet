import BIP84Payment from './BIP84Payment'
import { IPayment, NetworkInfoType, HDSigner } from './types'

function getPaymentInstance(
  paymentType = 'p2wpkh',
  bip32root: HDSigner, // TODO: is this correct?
  networkInfo: NetworkInfoType,
): IPayment {
  switch (paymentType) {
    case 'p2wpkh':
    default:
      return new BIP84Payment(bip32root, networkInfo)
  }
}

export default getPaymentInstance
