import { IRequest, OnRequest } from '../core'
import { RifWalletServicesFetcher } from '../rifWalletServices/RifWalletServicesFetcher'
import { BIP32Interface } from 'bip32'
import { Psbt, Network, HDSigner } from 'bitcoinjs-lib'
import BIPRequestPaymentFacade from './BIPRequestPaymentFacade'
import BitcoinNetwork from './BitcoinNetwork'
import BIPWithRequest from './BIPWithRequest'
import BIP from './BIP'

export { BIP32Interface, Psbt, Network, HDSigner }

export interface TransactionInputType {
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

export interface NetworkInfoType {
  bip32: { public: number; private: number }
  wif: number
  bech32: string
}

export interface UnspentTransactionType {
  txid: string
  vout: number
  value: string
  path: string
  address: string
  confirmations: number
}
/**
 * amountToPay: number
 * addressToPay: string
 * unspentTransactions: Array<>
 * miningFee: number
 */
export interface PaymentType {
  amountToPay: number
  addressToPay: string
  unspentTransactions: Array<UnspentTransactionType>
  miningFee: number
}

export type PaymentTypeWithBalance = PaymentType & { balance: number }

export type EstimateFeeType = Omit<PaymentType, 'miningFee'>

type PaymentTypeWithPaymentFacade = PaymentType & {
  payment: BIPRequestPaymentFacade
  balance: number
}

export type SendBitcoinRequestType = IRequest<
  'SEND_BITCOIN',
  PaymentTypeWithPaymentFacade,
  void, // TODO: is this correct?
  unknown // TODO: is this correct?
>

export interface BIPOptionsType {
  request?: OnRequest
  fetcher?: RifWalletServicesFetcher
  paymentFactory?: PaymentFactoryType
}

export type PaymentFactoryType = (
  paymentType: string,
  bip32root: BIP32Interface,
  networkInfo: NetworkInfoType,
) => IPayment // TODO: is this correct?

export interface IPayment {
  generatePayment: (
    amountToPay: number, // TODO: is this correct?
    addressToPay: string,
    unspentTransactions: UnspentTransactionType[],
    miningFee: number,
  ) => Psbt
  signPayment: (psbt: Psbt) => Psbt
  convertPaymentToHexString: (psbt: Psbt) => string
}

export type BitcoinRequest = SendBitcoinRequestType

export type BitcoinNetworkWithBIPRequest = Omit<BitcoinNetwork, 'bips'> & {
  bips: BIPWithRequest[]
}

export type createBipFactoryType = ConstructorParameters<typeof BIP>
