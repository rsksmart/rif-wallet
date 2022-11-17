import { payments } from 'bitcoinjs-lib'
import {
  HDSigner,
  IPayment,
  Network,
  NetworkInfoType,
  Psbt,
  TransactionInputType,
  UnspentTransactionType,
} from './types'

class BIP84Payment implements IPayment {
  bip32root!: HDSigner
  networkInfo: NetworkInfoType
  constructor(bip32root: HDSigner, networkInfo: NetworkInfoType) {
    this.bip32root = bip32root
    this.networkInfo = networkInfo
  }
  generatePayment(
    amountToPay: number,
    addressToPay: string,
    unspentTransactions: Array<UnspentTransactionType>,
    miningFee: number,
  ) {
    let amount: number = amountToPay + miningFee
    const psbt = new Psbt({ network: this.networkInfo as Network })
    for (const transaction of unspentTransactions) {
      amount = amount - Number(transaction.value)
      const transactionWithInput = this.createTransactionInput(transaction)
      psbt.addInput(transactionWithInput.input)
      if (amount <= 0) {
        break
      }
    }
    if (amount < 0) {
      // Send back to the first address
      psbt.addOutput({
        address: unspentTransactions[0].address,
        value: amount * -1,
      })
    }
    psbt.addOutput({
      address: addressToPay,
      value: amountToPay,
    })
    return psbt
  }

  signPayment(psbt: Psbt) {
    psbt.signAllInputsHD(this.bip32root)
    psbt.finalizeAllInputs()
    return psbt
  }

  convertPaymentToHexString(psbt: Psbt) {
    return psbt.extractTransaction().toHex().toString()
  }
  createTransactionInput(transaction: UnspentTransactionType) {
    const path = transaction.path
    const derived = this.bip32root.derivePath(path)
    const payment = payments.p2wpkh({
      network: this.networkInfo as Network,
      pubkey: derived.publicKey,
    })
    const hexoutput = payment.output as Buffer
    const input: TransactionInputType = {
      hash: transaction.txid,
      index: transaction.vout,
      witnessUtxo: {
        script: hexoutput,
        value: Number(transaction.value),
      },
      bip32Derivation: [
        {
          masterFingerprint: this.bip32root.fingerprint,
          path,
          pubkey: derived.publicKey,
        },
      ],
    }
    return {
      ...transaction,
      input,
    }
  }
}

export default BIP84Payment
