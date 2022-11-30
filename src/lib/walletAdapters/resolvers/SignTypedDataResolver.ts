import { RIFWallet } from '../../core'
import { IResolver } from '../RPCAdapter'

export class SignTypedDataResolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_signTypedData'

  constructor(signer: RIFWallet) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    // TODO: what is the type here?
    const { domain, message, types } = JSON.parse(params[1])

    // delete domain type
    if (types.EIP712Domain) {
      delete types.EIP712Domain
    }

    return this.signer._signTypedData(domain, types, message)
  }
}
