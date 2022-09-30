import BIP84Payment from './BIP84Payment'

function getPaymentInstance(paymentType: string = 'p2wpkh', ...args: any) {
  switch (paymentType) {
    case 'p2wpkh':
    default:
      // @ts-ignore
      return new BIP84Payment(...args)
  }
}

export default getPaymentInstance
