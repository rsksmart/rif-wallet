import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class GetTransactionByHashResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getTransactionByHash'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const txHash = params[0]

    return this.signer.provider?.getTransaction(txHash)
  }
}
