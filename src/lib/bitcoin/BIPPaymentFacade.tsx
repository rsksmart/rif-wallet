import { IPayment, PaymentType, Psbt } from './types'
import {
  ISendTransactionJsonReturnData,
  RifWalletServicesFetcher,
} from '../rifWalletServices/RifWalletServicesFetcher'
import { rifWalletServicesFetcher as defaultFetcherInstance } from '../../core/setup'

export default class BIPPaymentFacade {
  payment: IPayment
  fetcher: RifWalletServicesFetcher
  constructor(
    payment: IPayment,
    fetcher: RifWalletServicesFetcher = defaultFetcherInstance,
  ) {
    this.payment = payment
    this.fetcher = fetcher
  }
  async generatePayment({
    amountToPay,
    addressToPay,
    unspentTransactions,
    miningFee,
  }: PaymentType) {
    return this.payment.generatePayment(
      amountToPay,
      addressToPay,
      unspentTransactions,
      miningFee,
    )
  }

  signPayment(payment: Psbt) {
    return this.payment.signPayment(payment)
  }
  getPaymentHex(payment: Psbt) {
    return this.payment.convertPaymentToHexString(payment)
  }
  async sendTransaction(hexData: string) {
    return this.fetcher.sendTransactionHexData(hexData)
  }

  async signAndSend(payment: Psbt): Promise<ISendTransactionJsonReturnData> {
    console.log('signing...')
    const transaction = this.signPayment(payment)
    console.log('getting hex...')
    const hexData = this.getPaymentHex(transaction)
    console.log('sending tx...', hexData)
    return this.sendTransaction(hexData)
  }
}
