import { TransactionResponse } from '@ethersproject/providers'
import { constants, Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class SendTransactionResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_sendTransaction'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const payload = params.reduce((prev, curr) => ({ ...prev, ...curr }), {})

    if (payload.data === '') {
      // TODO: assign undefined once the RIFWallet changes are applied
      payload.data = constants.HashZero
    }

    return this.signer
      .sendTransaction(payload)
      .then((tx: TransactionResponse) => tx.hash)
  }
}
