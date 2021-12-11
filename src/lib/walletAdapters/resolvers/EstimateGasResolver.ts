import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class EstimateGasResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_estimateGas'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const tx = params[0]

    return this.signer.estimateGas(tx).then(b => b.toHexString())
  }
}
