import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class CallsResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_call'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const tx = params[0]
    const blockTag = params[1]

    return this.signer.call(tx, blockTag)
  }
}
