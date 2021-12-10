import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class NetVersionResolver implements IResolver {
  private signer: Signer
  public methodName = 'net_version'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    return this.signer.getChainId()
  }
}
