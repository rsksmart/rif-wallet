import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class GasPriceResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_gasPrice'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve() {
    return (await this.signer.getGasPrice()).toString()
  }
}
