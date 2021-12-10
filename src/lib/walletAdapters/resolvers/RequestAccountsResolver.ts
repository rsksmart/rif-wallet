import { RIFWallet } from '../../core'
import { IResolver } from '../RPCAdapter'

export class RequestAccountsResolver implements IResolver {
  private signer: RIFWallet
  public methodName = 'eth_requestAccounts'

  constructor(signer: RIFWallet) {
    this.signer = signer
  }

  async resolve() {
    return [this.signer.smartWalletAddress]
  }
}
