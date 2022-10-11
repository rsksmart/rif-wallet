import { HDSigner, payments, Psbt } from 'bitcoinjs-lib'

export type UnspentTransactionType = {
  txid: string
  vout: number
  value: string
  path: string
  address: string
}

class BIP84Payment {
  bip32root!: HDSigner
  networkInfo: any
  constructor(bip32root: HDSigner, networkInfo: any) {
    this.bip32root = bip32root
    this.networkInfo = networkInfo
  }
  generateHexPayment(
    amountToPay: number,
    addressToPay: string,
    unspentTransactions: Array<UnspentTransactionType>,
    miningFee: number,
  ) {
    let amount: number = amountToPay + miningFee
    const psbt = new Psbt({ network: this.networkInfo })
    for (const transaction of unspentTransactions) {
      amount = amount - Number(transaction.value)
      const transactionWithInput = this.createTransactionInput(transaction)
      psbt.addInput(transactionWithInput.input as any)
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
    psbt.signAllInputsHD(this.bip32root)
    psbt.finalizeAllInputs()
    return psbt.extractTransaction().toHex().toString()
  }

  createTransactionInput(transaction: UnspentTransactionType) {
    const path = transaction.path
    const derived = this.bip32root.derivePath(path)
    const payment = payments.p2wpkh({
      network: this.networkInfo,
      pubkey: derived.publicKey,
    })
    const hexoutput = payment.output
    const input = {
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
