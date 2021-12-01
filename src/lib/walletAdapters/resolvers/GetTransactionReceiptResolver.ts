import { Signer } from 'ethers'
import { IResolver } from '../RPCAdapter'
export class GetTransactionReceiptResolver implements IResolver {
  private signer: Signer
  public methodName = 'eth_getTransactionReceipt'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    const txHash = params[0]

    let result = await this.signer.provider?.getTransactionReceipt(txHash)

    if (!result) {
      const tx = await this.signer.provider?.getTransaction(txHash)
      result = await tx?.wait()
    }

    return result
  }
}
