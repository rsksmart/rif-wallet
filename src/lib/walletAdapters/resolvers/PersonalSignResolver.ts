import { Signer, utils } from 'ethers'
import { IResolver } from '../RPCAdapter'

export class PersonalSignResolver implements IResolver {
  private signer: Signer
  public methodName = 'personal_sign'

  constructor(signer: Signer) {
    this.signer = signer
  }

  async resolve(params: any[]) {
    let message = params[0]

    try {
      message = utils.toUtf8String(params[0])
    } catch {
      // use original message
    }

    return this.signer.signMessage(message)
  }
}
