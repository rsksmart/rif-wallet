import BIP84Payment from './BIP84Payment'
import { IRequest, OnRequest } from '../core'
import { RifWalletServicesFetcher } from '../rifWalletServices/RifWalletServicesFetcher'
import { BIP32Interface } from 'bip32'
import { Psbt, Network, HDSigner } from 'bitcoinjs-lib'
export { BIP32Interface, Psbt, Network, HDSigner }
export type TransactionInputType = {
  hash: string
  index: number
  witnessUtxo: {
    script: Buffer
    value: number
  }
  bip32Derivation: {
    masterFingerprint: Buffer
    path: string
    pubkey: Buffer
  }[]
}

export type NetworkInfoType = {
  bip32: { public: number; private: number }
  wif: number
  bech32: string
}

export type PaymentInstanceType = BIP84Payment

export type UnspentTransactionType = {
  txid: string
  vout: number
  value: string
  path: string
  address: string
}
/**
 * amountToPay: number
 * addressToPay: string
 * unspentTransactions: Array<>
 * miningFee: number
 */
export type PaymentType = {
  amountToPay: number
  addressToPay: string
  unspentTransactions: Array<UnspentTransactionType>
  miningFee: number
}

export type SendBitcoinRequestType = IRequest<
  'SEND_BITCOIN',
  PaymentType,
  string,
  void
>

export type BIPOptionsType = {
  request?: OnRequest
  fetcher?: RifWalletServicesFetcher
  paymentFactory?: any
}

export type PaymentFactoryType = (
  paymentType: string,
  bip32root: BIP32Interface,
  networkInfo: NetworkInfoType,
) => any

export interface IPayment {
  generatePayment: (...args: any[]) => Psbt | any
  signPayment: (...args: any[]) => Psbt | any
  convertPaymentToHexString: (...args: any[]) => string
}
