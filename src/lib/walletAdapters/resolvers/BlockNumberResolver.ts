import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class BlockNumberResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_blockNumber'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    return this.signer.provider?.getBlockNumber()
  }
}
