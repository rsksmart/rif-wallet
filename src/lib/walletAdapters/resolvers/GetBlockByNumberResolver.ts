import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class GetBlockByNumberResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getBlockByNumber'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve([blockOrTag]: any) {
    return this.signer.provider?.getBlock(blockOrTag)
  }
}
