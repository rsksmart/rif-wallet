import { TransactionResponse } from '@ethersproject/providers'
import { Signer, BigNumber } from 'ethers'
import { TransactionRequest } from '@ethersproject/abstract-provider'
import { IResolver } from '../RPCAdapter'

export class SendTransactionResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_sendTransaction'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const payload = params.reduce((prev, curr) => ({ ...prev, ...curr }), {})

    const formattedPayload: TransactionRequest = {
      to: payload.to,
      from: payload.from,
      nonce: payload.nonce,
      data: payload.data || '0x',
      value: BigNumber.from(payload.value || 0),
      chainId: payload.chainId,
      gasLimit: payload.gas ? BigNumber.from(payload.gas) : undefined, // WC's gas to gasLimit
      gasPrice: payload.gasPrice ? BigNumber.from(payload.gasPrice) : undefined,
    }

    return this.signer
      .sendTransaction(formattedPayload)
      .then((tx: TransactionResponse) => tx.hash)
  }
}
