import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class GetBlockNumberResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getBlockByNumber'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    return this.signer.provider?.getBlockNumber()
  }
}
